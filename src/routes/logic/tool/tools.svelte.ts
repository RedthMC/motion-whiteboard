import { type CursorName } from "../component/cursors.svelte";
import { Stroke, type Element, type ElementManager } from "../component/elements.svelte";
import type { StyleManager } from "../component/style_manager.svelte"; // Needed for tool implementations in this file
import { Vec2, Rect } from "../math/vector";
import { Camera } from "../component/camera.svelte";

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

    onDown(coords: MouseCoords): void {
        this.prevCoords = coords.canvas;
    }

    onMove(coords: MouseCoords): void {
        if (!this.prevCoords) return;

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

    private dragInfo: {
        draggedElement: Element,
        startElementPos: Vec2,
        startMousePos: Vec2;
    } | null = $state(null);

    onDown(coords: MouseCoords): void {
        const hit = this.elements.findElementAt(coords.canvas);
        if (hit) {
            this.elements.clearSelection();
            this.elements.select(hit);
            this.dragInfo = {
                draggedElement: hit,
                startElementPos: { ...hit.position },
                startMousePos: { ...coords.canvas }
            };
        } else {
            this.elements.clearSelection();
            this.dragInfo = null;
        }
    }

    onMove(coords: MouseCoords): void {
        if (!this.dragInfo) return;

        const delta = Vec2.subtract(coords.canvas, this.dragInfo.startMousePos);
        this.dragInfo.draggedElement.position = Vec2.add(this.dragInfo.startElementPos, delta);
    }

    onUp(coords: MouseCoords): void {
        this.dragInfo = null;
    }
}
