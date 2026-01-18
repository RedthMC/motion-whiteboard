import type { Camera } from "./camera.svelte";
import type { ElementManager, MouseCoords, StyleManager } from "./data.svelte";
import { Stroke, type Element } from "./elements";
import { Vec2, Rect } from "./vector";

export interface Tool {
    onDown(coords: MouseCoords): void;
    onMove(coords: MouseCoords): void;
    onUp(coords: MouseCoords): void;
}

// finished code
export class Pan implements Tool {
    private readonly camera: Camera;
    constructor(camera: Camera) { this.camera = camera; }
    private prevCoordsScreen: Vec2 | null = null;

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
        this.prevCoordsScreen = null;
    }
}

export class Brush implements Tool {
    private readonly elementManager: ElementManager;
    private readonly styleManager: StyleManager;

    constructor(elementManager: ElementManager, styleManager: StyleManager) {
        this.elementManager = elementManager;
        this.styleManager = styleManager;
    }

    private drawingStroke: { initialCoords: Vec2, points: Vec2[], stroke: Stroke; } | null = $state(null);

    onDown(coords: MouseCoords) {
        this.drawingStroke = {
            initialCoords: coords.canvas,
            points: [{ x: 0, y: 0 }],
            stroke: this.elementManager.addElement({
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
    private readonly elementManager: ElementManager;
    constructor(elementManager: ElementManager) { this.elementManager = elementManager; }

    private prevCoords: Vec2 | null = null;

    onDown(coords: MouseCoords): void {
        this.prevCoords = coords.canvas;
    }

    onMove(coords: MouseCoords): void {
        if (!this.prevCoords) return;

        const shouldBeKept = (e: Element) =>
            e.type !== "stroke" ||
            !Rect.inRect(e.boundingBox, Vec2.subtract(coords.canvas, e.position));
        this.elementManager.filterUpElements(shouldBeKept);
        this.prevCoords = coords.canvas;
    }

    onUp(coords: MouseCoords): void {
        this.prevCoords = null;
    }
}
