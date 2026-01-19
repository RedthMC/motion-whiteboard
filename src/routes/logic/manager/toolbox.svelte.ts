import { Cursor } from "./cursors.svelte";
import type { ModeFactory, Mode } from "../mode/modes.svelte";
import type { MouseCoords } from "../mode/state.svelte";
import type { ManagerProvider } from "../interface/interface";

export class Toolbox {
    private readonly app: ManagerProvider;
    private currentMode: Mode;

    constructor(app: ManagerProvider, defaultMode: ModeFactory) {
        this.app = app;
        this.currentMode = $state(defaultMode(app));
    }

    private getMouseCoords(event: MouseEvent): MouseCoords {
        const screenCoords = { x: event.clientX, y: event.clientY };
        const canvasCoords = this.app.camera.toCanvasCoords(screenCoords);
        return { canvas: canvasCoords, screen: screenCoords };
    }

    getCursorStyle() {
        return Cursor.getStyle(this.currentMode.getCursor());
    }

    getModeName() {
        return this.currentMode.type;
    }

    isIdle() {
        return this.currentMode.isIdle();
    }

    getRenderLayers() {
        return this.currentMode.getRenderLayers();
    }

    switchMode(factory: ModeFactory) {
        this.currentMode.destroy();
        this.currentMode = factory(this.app);
    }

    onPointerDown(event: PointerEvent) {
        this.currentMode.onDown(event.button, this.getMouseCoords(event));
    }

    onPointerMove(event: PointerEvent) {
        this.currentMode.onMove(this.getMouseCoords(event));
    }

    onPointerUp(event: PointerEvent) {
        this.currentMode.onUp();
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
