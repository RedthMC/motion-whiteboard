import { createTool, type Mode, type MouseCoords, type Tool } from "./mode.svelte";
import { Vec2 } from "../math/vector";
import type { ManagerProvider } from "../interface/interface";

export class HandMode implements Mode {
    readonly type = "hand";
    readonly idleCursor = "grab";
    readonly modeLayer = undefined;

    getPrimaryTool = createTool(Pan);
    getSecondaryTool = createTool(Pan);
}

export class Pan implements Tool {
    readonly type = "pan";
    readonly cursor = "grabbing";
    private prevCoordsScreen: Vec2;
    constructor(coords: MouseCoords, app: ManagerProvider) {
        this.prevCoordsScreen = coords.screen;
    }
    onMove(coords: MouseCoords, app: ManagerProvider) {
        const displacement = Vec2.subtract(this.prevCoordsScreen, coords.screen);
        app.camera.moveBy(displacement);
        this.prevCoordsScreen = coords.screen;
    };
}
