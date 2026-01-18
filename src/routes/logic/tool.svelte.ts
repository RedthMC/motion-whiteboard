import type { StyleManager } from "./app.svelte";
import type { Camera } from "./camera.svelte";
import type { CursorName } from "./cursors.svelte";
import { Stroke, type Element, type ElementManager } from "./elements.svelte";
import { Vec2, Rect } from "./math/vector";

export type MouseCoords = {
    canvas: Vec2;
    screen: Vec2;
};

export class Toolbox {
    private readonly camera: Camera;
    private readonly tools;

    constructor(
        elements: ElementManager,
        camera: Camera,
        styleManager: StyleManager
    ) {
        this.camera = camera;
        const pan = new Pan(camera);
        const brush = new Brush(elements, styleManager);
        const eraser = new Eraser(elements);
        this.tools = {
            hand: [pan, pan, pan],
            draw: [brush, pan, eraser],
            eraser: [eraser, pan],
        };
    }

    private getMouseCoords(event: MouseEvent): MouseCoords {
        const screenCoords = { x: event.clientX, y: event.clientY };
        const canvasCoords = this.camera.toCanvasCoords(screenCoords);
        return { canvas: canvasCoords, screen: screenCoords };
    }

    selectedTool: keyof typeof this.tools = $state("draw");
    activeTool: Tool | undefined = $state();

    get cursorName() { return this.activeTool?.cursor ?? this.tools[this.selectedTool][0].cursor; }

    switchTool(toolName: keyof typeof this.tools) {
        this.selectedTool = toolName;
    }

    onPointerDown(event: PointerEvent) {
        this.activeTool = this.tools[this.selectedTool].at(event.button);
        if (!this.activeTool) return;
        this.activeTool.onDown(this.getMouseCoords(event));
    }

    onPointerMove(event: PointerEvent) {
        if (!this.activeTool) return;
        this.activeTool.onMove(this.getMouseCoords(event));
    }

    onPointerUp(event: PointerEvent) {
        if (!this.activeTool) return;
        this.activeTool.onUp(this.getMouseCoords(event));
        this.activeTool = undefined;
    }

    onWheel(event: WheelEvent) {
        event.preventDefault(); // prevent browser ctrl+scroll
        const scale = event.deltaY < 0 ? 1.25 : 0.8;
        this.camera.zoomAt(this.getMouseCoords(event).screen, scale);
    }

    onContextMenu(event: MouseEvent) {
        event.preventDefault();
    }

}

export interface Tool {
    readonly cursor: CursorName;
    onDown(coords: MouseCoords): void;
    onMove(coords: MouseCoords): void;
    onUp(coords: MouseCoords): void;
}

export class Pan implements Tool {
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

export class Brush implements Tool {
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
                color: this.styleManager.style.color,
                size: this.styleManager.style.size,
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

export class Eraser implements Tool {
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
