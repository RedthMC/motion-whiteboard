import type { ManagerProvider } from "../interface/interface";
import { type ModeState, type MouseCoords } from "./state.svelte";
import { drawingState } from "./state/drawing.svelte";
import { panningState } from "./state/pan.svelte";
import { erasingState } from "./state/erasing.svelte";
import { selectingState } from "./state/select.svelte";
import type { CursorName } from "../manager/cursors.svelte";

type StateGroup = ((app: ManagerProvider, mouse: MouseCoords) => ModeState)[];

export interface CanvasMode {
    readonly type: string;
    readonly Idle: ModeState;
    readonly stateGroups: StateGroup;
}

export class IdleState implements ModeState {
    readonly cursor: CursorName;
    constructor(cursor: CursorName) { this.cursor = cursor; }
    onMove() { }
    destroy() { }
}

export class SelectMode implements CanvasMode {
    readonly type = "select";
    readonly Idle = new IdleState("select");
    readonly stateGroups: StateGroup = [
        selectingState,
        panningState
    ];
}

export class DrawMode implements CanvasMode {
    readonly type = "draw";
    readonly Idle = new IdleState("pencil");
    readonly stateGroups: StateGroup = [
        drawingState,
        panningState,
        erasingState
    ];
}

export class EraserMode implements CanvasMode {
    readonly type = "eraser";
    readonly Idle = new IdleState("eraser");
    readonly stateGroups: StateGroup = [
        erasingState,
        panningState
    ];
}

export class HandMode implements CanvasMode {
    readonly type = "hand";
    readonly Idle = new IdleState("grab");
    readonly stateGroups: StateGroup = [
        panningState,
        panningState
    ];
}

export const Modes = {
    select: new SelectMode(),
    draw: new DrawMode(),
    eraser: new EraserMode(),
    hand: new HandMode()
}

