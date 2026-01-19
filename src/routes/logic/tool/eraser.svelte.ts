import { type CanvasTool, type MouseCoords } from "./tools.svelte";
import { Vec2 } from "../math/vector";
import { ScribbleBuilder } from "../math/stroke";
import type { ElementProvider } from "../interface/interface";

export class Eraser implements CanvasTool {
    private readonly elements: ElementProvider;
    constructor(elements: ElementProvider) { this.elements = elements; }

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
        this.elements.filterUpElements(el => !el.hitTest(coords.canvas));
        this.prevCoords = coords.canvas;
    }

    onUp(coords: MouseCoords): void {
        this.prevCoords = null;
    }
}
