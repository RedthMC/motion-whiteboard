import type { Camera } from "./camera.svelte";
import { Cursor } from "./cursors.svelte";
import type { CanvasTool, MouseCoords } from "../tool/tools.svelte";
import type { CanvasMode } from "../mode/modes.svelte";

export class Toolbox {
    private readonly camera: Camera;

    // High level state
    currentMode: CanvasMode = $state() as CanvasMode;
    activeTool: CanvasTool | undefined = $state();

    constructor(defaultMode: CanvasMode, camera: Camera) {
        this.camera = camera;
        this.currentMode = defaultMode;
    }

    private getMouseCoords(event: MouseEvent): MouseCoords {
        const screenCoords = { x: event.clientX, y: event.clientY };
        const canvasCoords = this.camera.toCanvasCoords(screenCoords);
        return { canvas: canvasCoords, screen: screenCoords };
    }

    // The tool that is "default" for the current mode (left-click tool)
    primaryTool: CanvasTool = $derived.by(() => this.currentMode.toolGroups[0]);

    // The tool currently "in charge" of the cursor/layer visuals
    currentVisualTool: CanvasTool = $derived(this.activeTool ?? this.primaryTool);

    cursor: string = $derived(Cursor.getStyle(this.currentVisualTool.cursor));

    switchMode(mode: CanvasMode) {
        this.currentMode = mode;
    }

    onPointerDown(event: PointerEvent) {
        this.activeTool = this.currentMode.toolGroups.at(event.button);
        if (!this.activeTool) return;
        this.activeTool.onDown(this.getMouseCoords(event));
    }

    onPointerMove(event: PointerEvent) {
        if (!this.activeTool) return;
        this.activeTool.onMove(this.getMouseCoords(event));
    }

    onPointerUp(event: PointerEvent) {
        if (!this.activeTool) return;
        this.activeTool.onUp(this.getMouseCoords(event));
        this.activeTool = undefined;
    }

    onWheel(event: WheelEvent) {
        event.preventDefault(); // prevent browser ctrl+scroll
        const scale = event.deltaY < 1 ? 1.25 : 0.8;
        this.camera.zoomAt(this.getMouseCoords(event).screen, scale);
    }

    onContextMenu(event: MouseEvent) {
        event.preventDefault();
    }
}
