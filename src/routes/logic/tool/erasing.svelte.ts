import { createTool, type Mode, type MouseCoords, type Tool } from "./mode.svelte";
import type { ManagerProvider } from "../interface/interface";
import { Pan } from "./pan.svelte";

export class EraseMode implements Mode {
    readonly type = "eraser";
    readonly idleCursor = "eraser";
    readonly modeLayer = undefined;

    getPrimaryTool = createTool(Eraser);
    getSecondaryTool = createTool(Pan);
}

export class Eraser implements Tool {
    readonly type = "eraser";
    readonly cursor = "eraser";
    constructor(coords: MouseCoords, app: ManagerProvider) {
        app.trail.addPoint(coords.canvas);
        app.elements.filterUpElements(el => !el.hitTest(coords.canvas));
    };
    onMove(coords: MouseCoords, app: ManagerProvider) {
        app.trail.addPoint(coords.canvas);
        app.elements.filterUpElements(el => !el.hitTest(coords.canvas));
    };
}