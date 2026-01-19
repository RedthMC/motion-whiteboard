import type { CanvasTool } from "../tool/tools.svelte";
import { Pan } from "../tool/pan.svelte";
import { Brush } from "../tool/brush.svelte";
import { Eraser } from "../tool/eraser.svelte";
import { Select } from "../tool/select.svelte";
import type { ManagerProvider } from "../interface/interface";
import { stateManager } from "../state.svelte";

export interface CanvasMode {
    readonly type: string;
    readonly toolGroups: CanvasTool[];
}

export class SelectMode implements CanvasMode {
    readonly type = "select";
    readonly toolGroups: CanvasTool[];

    constructor(app: ManagerProvider) {
        const selectTool = new Select(app);
        const panTool = new Pan(app);
        this.toolGroups = [selectTool, panTool, panTool];
    }
}


const Idle = { destroy() { } };
type Idle = typeof Idle;

export class DrawMode implements CanvasMode {
    readonly type = "draw";
    readonly toolGroups: CanvasTool[];
    // readonly state = stateManager<Idle | Brush | Pan | Eraser>(Idle);

    constructor(app: ManagerProvider) {
        const brush = new Brush(app);
        const pan = new Pan(app);
        const eraser = new Eraser(app);
        this.toolGroups = [brush, pan, eraser];
    }
}

export class EraserMode implements CanvasMode {
    readonly type = "eraser";
    readonly toolGroups: CanvasTool[];

    constructor(app: ManagerProvider) {
        const eraser = new Eraser(app);
        const pan = new Pan(app);
        this.toolGroups = [eraser, pan];
    }
}

export class HandMode implements CanvasMode {
    readonly type = "hand";
    readonly toolGroups: CanvasTool[];

    constructor(app: ManagerProvider) {
        const pan = new Pan(app);
        this.toolGroups = [pan, pan, pan];
    }
}
