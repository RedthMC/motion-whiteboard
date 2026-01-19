import { type CanvasTool, type MouseCoords } from "./tools.svelte";
import type { Element, ElementProvider } from "../interface/interface";
import { Vec2, Rect } from "../math/vector";
import { TextElement } from "../element/text/text_element.svelte";

export class Select implements CanvasTool {
    private readonly elements: ElementProvider;
    constructor(elements: ElementProvider) { this.elements = elements; }

    readonly cursor = "select";
    selectedElements: Element[] = $state([]);

    setSelection(elements: Element[]) {
        this.selectedElements = elements;
    }

    select(element: Element) {
        if (!this.selectedElements.includes(element)) {
            this.selectedElements.push(element);
        }
    }

    deselect(element: Element) {
        this.selectedElements.splice(this.selectedElements.indexOf(element), 1);
    }

    clearSelection() {
        this.selectedElements = [];
    }

    private dragInfo: {
        elements: { el: Element, startPos: Vec2; }[],
        startMousePos: Vec2;
    } | null = $state(null);

    selectionFrame: Rect | null = $state(null);
    selectedFrame: Rect | null = $derived.by(() => {
        if (this.selectedElements.length === 0) return null;
        return this.selectedElements.map(el => Rect.add(el.boundingBox, el.position)).reduce((a, b) => Rect.merge(a, b));
    });
    editingText: TextElement | null = $state(null);
    private frameStart: Vec2 | null = null;

    onDown(coords: MouseCoords): void {
        const hit = this.elements.findElementAt(coords.canvas);
        this.editingText = null;
        if (hit) {
            // If hit element is NOT already selected, select only it.
            // If it IS already selected, we drag all selected elements.
            if (!this.selectedElements.includes(hit)) {
                this.clearSelection();
                this.select(hit);
            }

            this.dragInfo = {
                elements: this.selectedElements.map(el => ({
                    el,
                    startPos: { ...el.position }
                })),
                startMousePos: { ...coords.canvas }
            };
        } else {
            this.clearSelection();
            this.dragInfo = null;
            this.frameStart = coords.canvas;
            this.selectionFrame = Rect.fromPoints(this.frameStart, this.frameStart);
        }
    }

    onMove(coords: MouseCoords): void {
        if (this.dragInfo) {
            const delta = Vec2.subtract(coords.canvas, this.dragInfo.startMousePos);
            for (const item of this.dragInfo.elements) {
                item.el.position = Vec2.add(item.startPos, delta);
            }
        } else if (this.frameStart) {
            this.selectionFrame = Rect.fromPoints(this.frameStart, coords.canvas);
            const elementsInRect = this.elements.getElementsByRect(this.selectionFrame);
            this.setSelection(elementsInRect);
        }
    }

    onUp(coords: MouseCoords): void {
        if (this.selectionFrame) {
            const elementsInRect = this.elements.getElementsByRect(this.selectionFrame);
            this.setSelection(elementsInRect);
        }

        // If only one hit element and it is text
        if (this.selectedElements.length === 1 && this.selectedElements[0] instanceof TextElement) {
            this.editingText = this.selectedElements[0];
        }
        this.dragInfo = null;
        this.frameStart = null;
        this.selectionFrame = null;
    }
}
