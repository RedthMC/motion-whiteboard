import { type CursorName } from "../component/cursors.svelte";
import { Stroke, type Element, type ElementManager } from "../component/elements.svelte";
import type { StyleManager } from "../component/style_manager.svelte"; // Needed for tool implementations in this file
import { Vec2, Rect } from "../math/vector";
import { Camera } from "../component/camera.svelte";
import { ScribbleBuilder } from "../math/stroke";

export type MouseCoords = {
    canvas: Vec2;
    screen: Vec2;
};

export interface CanvasTool {
    readonly cursor: CursorName;
    onDown(coords: MouseCoords): void;
    onMove(coords: MouseCoords): void;
    onUp(coords: MouseCoords): void;
}

export class Pan implements CanvasTool {
    private readonly camera: Camera;
    constructor(camera: Camera) { this.camera = camera; }

    private prevCoordsScreen: Vec2 | undefined = $state();

    readonly cursor = $derived(this.prevCoordsScreen ? "grabbing" : "grab");

    onDown(coords: MouseCoords): void {
        this.prevCoordsScreen = coords.screen;
    }

    onMove(coords: MouseCoords): void {
        if (!this.prevCoordsScreen) return;
        const displacement = Vec2.subtract(this.prevCoordsScreen, coords.screen);
        this.camera.moveBy(displacement);
        this.prevCoordsScreen = coords.screen;
    }

    onUp(coords: MouseCoords): void {
        this.prevCoordsScreen = undefined;
    }
}

export class Brush implements CanvasTool {
    private readonly elements: ElementManager;
    private readonly styleManager: StyleManager;

    constructor(elements: ElementManager, styleManager: StyleManager) {
        this.elements = elements;
        this.styleManager = styleManager;
    }

    readonly cursor = "pencil";

    private drawingStroke: { initialCoords: Vec2, points: Vec2[], stroke: Stroke; } | null = $state(null);

    onDown(coords: MouseCoords) {
        this.drawingStroke = {
            initialCoords: coords.canvas,
            points: [{ x: 0, y: 0 }],
            stroke: this.elements.addElement({
                type: "stroke",
                id: crypto.randomUUID(),
                position: coords.canvas,
                path: "M0,0Z",
                boundingBox: { left: -5, top: -5, right: 5, bottom: 5 }, // TODO: base on stroke width
                color: this.styleManager.color,
                size: this.styleManager.size,
            }),
        };
    }

    onMove(coords: MouseCoords) {
        if (!this.drawingStroke) return; // "drawingStroke is null" means "mouse is not down"

        const pointOffset = Vec2.subtract(coords.canvas, this.drawingStroke.initialCoords);
        this.drawingStroke.points.push(pointOffset);
        this.drawingStroke.stroke.boundingBox = Rect.expand(this.drawingStroke.stroke.boundingBox, pointOffset);
        this.drawingStroke.stroke.path = Stroke.toSvgPath(this.drawingStroke.points);
    }

    onUp(coords: MouseCoords) {
        this.drawingStroke = null;
    }
}

export class Eraser implements CanvasTool {
    private readonly elements: ElementManager;
    constructor(elements: ElementManager) { this.elements = elements; }

    readonly cursor = "eraser";

    private prevCoords: Vec2 | null = null;
    private scribbleBuilder = new ScribbleBuilder();
    trailPath = $state(this.scribbleBuilder.buildPath(25));

    private timer: NodeJS.Timeout | null = null;
    startTimer() {
        if (this.timer) return;
        this.timer = setInterval(() => {
            this.trailPath = this.scribbleBuilder.buildPath(25);
        }, 16);
    }

    onDown(coords: MouseCoords): void {
        this.prevCoords = coords.canvas;
        this.scribbleBuilder.addPoint(coords.canvas);
        this.startTimer();
    }

    onMove(coords: MouseCoords): void {
        if (!this.prevCoords) return;

        this.scribbleBuilder.addPoint(coords.canvas);

        const shouldBeKept = (e: Element) =>
            e.type !== "stroke" ||
            !Rect.inRect(e.boundingBox, Vec2.subtract(coords.canvas, e.position));
        this.elements.filterUpElements(shouldBeKept);
        this.prevCoords = coords.canvas;
    }

    onUp(coords: MouseCoords): void {
        this.prevCoords = null;
    }
}

export class Select implements CanvasTool {
    private readonly elements: ElementManager;
    constructor(elements: ElementManager) { this.elements = elements; }

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
    private frameStart: Vec2 | null = null;

    onDown(coords: MouseCoords): void {
        const hit = this.elements.findElementAt(coords.canvas);
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
        this.dragInfo = null;
        this.frameStart = null;
        this.selectionFrame = null;
    }
}
