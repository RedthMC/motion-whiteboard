import type { ManagerProvider } from "../interface/interface";
import { type ToolState, type MouseCoords, type ComponentWithData, componentWithData } from "./state.svelte";
import { pencilTool } from "./state/drawing.svelte";
import { panningTool } from "./state/pan.svelte";
import { eraserTool } from "./state/erasing.svelte";
import { selectingTool } from "./state/select.svelte";
import type { CursorName } from "../manager/cursors.svelte";
import SelectLayer from "../../ui/layers/SelectLayer.svelte";

type ToolGroup = ((app: ManagerProvider, mouse: MouseCoords) => ToolState)[];

interface ModeOptions {
    readonly type: string;
    readonly modeLayer?: ComponentWithData;
    readonly idleCursor: CursorName;
    readonly toolGroup: ToolGroup;
}

export interface Mode {
    readonly type: string;
    getCursor(): CursorName;
    getRenderLayers(): ComponentWithData[];
    isIdle(): boolean;
    onDown(button: number, mouse: MouseCoords): void;
    onMove(mouse: MouseCoords): void;
    onUp(): void;
    destroy(): void;
}

function stateMachine(app: ManagerProvider, mode: ModeOptions): Mode {
    let state: ToolState | undefined = $state();
    return {
        type: mode.type,
        getCursor: () => state?.cursor ?? mode.idleCursor,
        getRenderLayers: () => [state?.layer?.(), mode.modeLayer].filter(l => l !== undefined),
        isIdle: () => state === undefined,

        onDown: (button: number, mouse: MouseCoords) => {
            state?.destroy?.();
            state = mode.toolGroup.at(button)?.(app, mouse);
        },
        onMove: (mouse: MouseCoords) => {
            state?.onMove(mouse);
        },
        onUp: () => {
            state?.destroy?.();
            state = undefined;
        },
        destroy: () => {
            state?.destroy?.();
            state = undefined;
        }
    };
}

function modeFactory(mode: ModeOptions): ModeFactory {
    return (app) => stateMachine(app, mode);
}

export type ModeFactory = (app: ManagerProvider) => Mode;
export const ModeFactory: Record<string, ModeFactory> = {
    select: modeFactory({
        type: "select",
        modeLayer: componentWithData(SelectLayer, {}),
        idleCursor: "select",
        toolGroup: [
            selectingTool,
            panningTool
        ]
    }),
    draw: modeFactory({
        type: "draw",
        idleCursor: "pencil",
        toolGroup: [
            pencilTool,
            panningTool,
            eraserTool
        ]
    }),
    eraser: modeFactory({
        type: "eraser",
        idleCursor: "eraser",
        toolGroup: [
            eraserTool,
            panningTool
        ]
    }),
    hand: modeFactory({
        type: "hand",
        idleCursor: "grab",
        toolGroup: [
            panningTool,
            panningTool
        ]
    })
}

