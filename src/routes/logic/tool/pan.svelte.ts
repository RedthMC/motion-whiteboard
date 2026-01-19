import { type CanvasTool, type MouseCoords } from "./tools.svelte";
import { Vec2 } from "../math/vector";
import type { ManagerProvider } from "../interface/interface";

export class Pan implements CanvasTool {
    private readonly app: ManagerProvider;
    constructor(app: ManagerProvider) { this.app = app; }

    private prevCoordsScreen: Vec2 | undefined = $state();

    readonly cursor = $derived(this.prevCoordsScreen ? "grabbing" : "grab");

    onDown(coords: MouseCoords): void {
        this.prevCoordsScreen = coords.screen;
    }

    onMove(coords: MouseCoords): void {
        if (!this.prevCoordsScreen) return;
        const displacement = Vec2.subtract(this.prevCoordsScreen, coords.screen);
        this.app.camera.moveBy(displacement);
        this.prevCoordsScreen = coords.screen;
    }

    onUp(coords: MouseCoords): void {
        this.prevCoordsScreen = undefined;
    }
}
