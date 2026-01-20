import type { Component } from "svelte";
import type { ManagerProvider } from "../interface/interface";
import type { CursorName } from "../manager/cursors.svelte";
import type { Vec2 } from "../math/vector";


export type MouseCoords = {
    screen: Vec2;
    canvas: Vec2;
};

export type ModeState = {
    readonly cursor: CursorName;
    onMove(mouse: MouseCoords): void;
    destroy(): void;
};

export type ComponentWithData = {
    component: Component<any>;
    data: any;
};
export function componentWithData<T extends Record<string, any>>(component: Component<T>, data: T): ComponentWithData {
    return { component, data };
}

export interface Mode {
    readonly type: string;
    readonly idleCursor: CursorName;
    readonly modeLayer?: ComponentWithData;

    getPrimaryTool(coords: MouseCoords, app: ManagerProvider): Tool;
    getSecondaryTool?(coords: MouseCoords, app: ManagerProvider): Tool;
    getTertiaryTool?(coords: MouseCoords, app: ManagerProvider): Tool;
};

type ToolConstructor = {
    new(coords: MouseCoords, app: ManagerProvider): Tool;
};
export function createTool(toolClass: ToolConstructor) {
    return (coords: MouseCoords, app: ManagerProvider) => new toolClass(coords, app);
}
export interface Tool {
    readonly type: string;
    readonly cursor?: CursorName;
    readonly onMove: (coords: MouseCoords, app: ManagerProvider) => void;
    readonly onUp?: (coords: MouseCoords, app: ManagerProvider) => void;
    readonly layer?: ComponentWithData;
}
