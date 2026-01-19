import type { CursorName } from "../manager/cursors.svelte";
import { Vec2 } from "../math/vector";

export type MouseCoords = {
    screen: Vec2;
    canvas: Vec2;
};

export type ModeState = {
    readonly cursor: CursorName;
    onMove(mouse: MouseCoords): void;
    destroy(): void;
};
export function stateManager<T extends ModeState>(initialState: T): T {
    const state = $state(initialState);
    $effect(() => state.destroy());
    return state;
}


