import { Camera } from "./camera.svelte";
import { Cursor } from "./cursors.svelte";
import { ElementManager } from "./elements.svelte";
import { Toolbox } from "./tool.svelte";

export class AppState {
    readonly elements = new ElementManager();
    readonly camera = new Camera();
    readonly styleManager = new StyleManager();
    readonly toolbox = new Toolbox(this.elements, this.camera, this.styleManager);
    readonly cursor = new Cursor(this.toolbox);
}

export class StyleManager {
    readonly colors = [
        "#000000",
        "#9ca3af",
        "#e879f9",
        "#a855f7",
        "#3b82f6",
        "#0ea5e9",
        "#f59e0b",
        "#f97316",
        "#098d44",
        "#22c55e",
        "#f08193",
        "#ef4444",
    ];

    style = $state({
        color: this.colors[0],
        size: 3,
    });
}