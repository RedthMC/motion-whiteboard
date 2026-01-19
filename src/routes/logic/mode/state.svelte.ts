import type { Component } from "svelte";
import type { CursorName } from "../manager/cursors.svelte";
import { Vec2 } from "../math/vector";

export type MouseCoords = {
    screen: Vec2;
    canvas: Vec2;
};

export type ComponentWithData = {
    component: Component<any>;
    data: any;
};

export function componentWithData<T extends Record<string, any>>(component: Component<T>, data: T): ComponentWithData {
    return { component, data };
}

export type ToolState = {
    readonly cursor: CursorName;
    readonly layer?: () => ComponentWithData;

    onMove(mouse: MouseCoords): void;
    destroy?(): void;
};


