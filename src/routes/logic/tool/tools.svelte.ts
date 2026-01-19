import { type CursorName } from "../manager/cursors.svelte";
import { Vec2 } from "../math/vector";

export type MouseCoords = {
    canvas: Vec2;
    screen: Vec2;
};

export interface CanvasTool {
    readonly cursor: CursorName;
    onDown(coords: MouseCoords): void;
    onMove(coords: MouseCoords): void;
    onUp(coords: MouseCoords): void;
}

export { Pan } from "./pan.svelte";
export { Brush } from "./brush.svelte";
export { Eraser } from "./eraser.svelte";
export { Select } from "./select.svelte";
