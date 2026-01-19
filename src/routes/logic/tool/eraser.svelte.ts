import { type CanvasTool, type MouseCoords } from "./tools.svelte";
import { Vec2 } from "../math/vector";
import type { ManagerProvider } from "../interface/interface";

export class Eraser implements CanvasTool {
    readonly cursor = "eraser";

    private readonly app: ManagerProvider;
    constructor(app: ManagerProvider) { this.app = app; }

    private prevCoords: Vec2 | null = null;

    onDown(coords: MouseCoords): void {
        this.prevCoords = coords.canvas;
        this.app.trail.addPoint(coords.canvas);
    }

    onMove(coords: MouseCoords): void {
        this.app.trail.addPoint(coords.canvas);
        this.app.elements.filterUpElements(el => !el.hitTest(coords.canvas));
        this.prevCoords = coords.canvas;
    }

    onUp(coords: MouseCoords): void {
        this.prevCoords = null;
    }
}
