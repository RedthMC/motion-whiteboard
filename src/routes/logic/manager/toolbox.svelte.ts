import { Cursor } from "./cursors.svelte";
import type { CanvasMode } from "../mode/modes.svelte";
import type { ModeState, MouseCoords } from "../mode/state.svelte";
import type { ManagerProvider } from "../interface/interface";

export class Toolbox {
    private readonly app: ManagerProvider;

    currentMode: CanvasMode;
    currentState: ModeState;
    cursor: string;

    constructor(app: ManagerProvider, defaultMode: CanvasMode) {
        this.app = app;
        this.currentMode = $state(defaultMode);
        this.currentState = $state(this.currentMode.Idle);
        this.cursor = $derived(Cursor.getStyle(this.currentState.cursor));
    }

    private getMouseCoords(event: MouseEvent): MouseCoords {
        const screenCoords = { x: event.clientX, y: event.clientY };
        const canvasCoords = this.app.camera.toCanvasCoords(screenCoords);
        return { canvas: canvasCoords, screen: screenCoords };
    }

    switchMode(mode: CanvasMode) {
        this.currentMode = mode;
        this.currentState = this.currentMode.Idle;
    }

    onPointerDown(event: PointerEvent) {
        this.currentState = this.currentMode.stateGroups.at(event.button)?.(this.app, this.getMouseCoords(event)) ?? this.currentMode.Idle;
    }

    onPointerMove(event: PointerEvent) {
        this.currentState.onMove(this.getMouseCoords(event));
    }

    onPointerUp(event: PointerEvent) {
        this.currentState.destroy();
        this.currentState = this.currentMode.Idle;
    }

    onWheel(event: WheelEvent) {
        event.preventDefault(); // prevent browser ctrl+scroll
        const scale = event.deltaY < 1 ? 1.25 : 0.8;
        this.app.camera.zoomAt(this.getMouseCoords(event).screen, scale);
    }

    onContextMenu(event: MouseEvent) {
        event.preventDefault();
    }
}
