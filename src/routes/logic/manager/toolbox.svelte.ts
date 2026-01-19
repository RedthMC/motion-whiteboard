import type { Camera } from "./camera.svelte";
import { Cursor } from "./cursors.svelte";
import type { CanvasTool, MouseCoords } from "../tool/tools.svelte";

export class Toolbox<Key extends string> {
    private readonly camera: Camera;
    private readonly toolGroups: { [K in Key]: CanvasTool[] };

    constructor(
        toolGroups: { [K in Key]: CanvasTool[] },
        defaultTool: Key,
        camera: Camera
    ) {
        this.camera = camera;
        this.toolGroups = toolGroups;
        this.selectedTool = defaultTool;
    }

    private getMouseCoords(event: MouseEvent): MouseCoords {
        const screenCoords = { x: event.clientX, y: event.clientY };
        const canvasCoords = this.camera.toCanvasCoords(screenCoords);
        return { canvas: canvasCoords, screen: screenCoords };
    }

    selectedTool: Key = $state() as Key;
    activeTool: CanvasTool | undefined = $state();
    cursor: string = $derived.by(() => {
        const cursorName = this.activeTool?.cursor ?? this.toolGroups[this.selectedTool]?.[0]?.cursor ?? "default";
        return Cursor.getStyle(cursorName);
    });

    switchTool(toolName: Key) {
        this.selectedTool = toolName;
    }

    onPointerDown(event: PointerEvent) {
        this.activeTool = this.toolGroups[this.selectedTool].at(event.button);
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
