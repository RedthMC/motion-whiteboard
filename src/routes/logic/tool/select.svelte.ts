import { type CanvasTool, type MouseCoords } from "./tools.svelte";
import type { Element, ManagerProvider } from "../interface/interface";
import { Vec2, Rect } from "../math/vector";
import { TextElement } from "../element/text/text_element.svelte";
import SelectLayer from "../../ui/layers/SelectLayer.svelte";

export class Select implements CanvasTool {
    private readonly app: ManagerProvider;

    constructor(app: ManagerProvider) { this.app = app; }

    readonly cursor = "select";
    readonly layer = SelectLayer;

    private dragInfo: {
        elements: { el: Element, startPos: Vec2; }[],
        startMousePos: Vec2;
    } | null = $state(null);

    selectionFrame: Rect | null = $state(null);
    private frameStart: Vec2 | null = null;

    onDown(coords: MouseCoords): void {
        const hit = this.app.elements.findElementAt(coords.canvas);
        this.app.selection.editingText = null;
        if (hit) {
            // If hit element is NOT already selected, select only it.
            if (!this.app.selection.selectedElements.includes(hit)) {
                this.app.selection.clearSelection();
                this.app.selection.select(hit);
            }

            this.dragInfo = {
                elements: this.app.selection.selectedElements.map(el => ({
                    el,
                    startPos: { ...el.position }
                })),
                startMousePos: { ...coords.canvas }
            };
        } else {
            this.app.selection.clearSelection();
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
            const elementsInRect = this.app.elements.getElementsByRect(this.selectionFrame);
            this.app.selection.setSelection(elementsInRect);
        }
    }

    onUp(coords: MouseCoords): void {
        if (this.selectionFrame) {
            const elementsInRect = this.app.elements.getElementsByRect(this.selectionFrame);
            this.app.selection.setSelection(elementsInRect);
        }

        // If only one hit element and it is text
        if (this.app.selection.selectedElements.length === 1 && this.app.selection.selectedElements[0] instanceof TextElement) {
            this.app.selection.editingText = this.app.selection.selectedElements[0] as TextElement;
        }
        this.dragInfo = null;
        this.frameStart = null;
        this.selectionFrame = null;
    }
}
