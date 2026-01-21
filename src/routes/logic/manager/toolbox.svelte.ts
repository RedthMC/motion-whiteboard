import { Cursor } from "./cursors.svelte";
import type { ManagerProvider } from "../interface/interface";
import { Vec2 } from "../math/vector";
import { SelectMode } from "../tool/select.svelte";
import { DrawMode } from "../tool/drawing.svelte";
import { EraseMode } from "../tool/erasing.svelte";
import { HandMode } from "../tool/pan.svelte";
import type { ComponentWithData, Mode, MouseCoords, Tool } from "../tool/mode.svelte";

// // --- Tool Data Types ---

// /**
//  * Represents the data state of an individual tool during an active interaction.
//  */
// export type ToolData = SelectTool | Pan | Brush | Erase | Idle;
// export type SelectTool = {
//     type: "select";
//     action: Frame | Move;
// };
// export type Frame = { type: "frame"; startPos: Vec2; endPos: Vec2; };
// export type Move = {
//     type: "move";
//     targets: { el: any, startPos: Vec2; }[];
//     startMousePos: Vec2;
// };
// export type Pan = { type: "pan"; prevCoords: Vec2; };
// export type Brush = {
//     type: "brush";
//     element: StrokeElement;
//     initialCoords: Vec2;
// };
// export type Erase = { type: "erase"; prevCoords: Vec2; };
// export type Idle = { type: "idle"; };

// // --- Mode Data Types ---

// /**
//  * Discrete modes the application can be in, which define the available tools and 
//  * primary interaction behaviors.
//  */
// export type ModeName = "select" | "draw" | "eraser" | "hand";

// export type SelectModeData = { type: "select"; tool: SelectTool | Pan | Idle; };
// export type DrawModeData = { type: "draw"; tool: Brush | Pan | Erase | Idle; };
// export type EraserModeData = { type: "eraser"; tool: Erase | Pan | Idle; };
// export type HandModeData = { type: "hand"; tool: Pan | Idle; };

// export type ModeData = SelectModeData | DrawModeData | EraserModeData | HandModeData;

// // --- Helper Types for Registry Logic ---

// type ToolName = ToolData["type"];

// type ToolThatIs<T extends ToolName> = Extract<ToolData, { type: T; }>;

// type ModeWithTool<T extends ToolName> =
//     Exclude<ModeData, { tool: { type: Exclude<ToolName, T>; }; }>;

// type ModeInTool<T extends ToolName> = { type: ModeWithTool<T>, tool: ToolThatIs<T>; };
// /**
//  * Interface for tool logic implementation.
//  * T is the type of ToolData this logic operates on.
//  */
// type ToolFunction<T extends ToolName> = {
//     cursor?: CursorName;
//     onDown: (mode: ModeWithTool<T>, coords: MouseCoords, app: ManagerProvider) => void;
//     onMove: (
//         mode: ModeInTool<T>,
//         coords: MouseCoords,
//         app: ManagerProvider
//     ) => void;
//     onUp: (mode: ModeInTool<T>, coords: MouseCoords, app: ManagerProvider) => void;
//     layer?: (tool: T extends ToolName ? ToolThatIs<T> : never) => ComponentWithData | undefined;
// };

// // --- Registries ---

// /**
//  * Configuration for each Mode.
//  * associative mapping of mouse buttons to ToolNames.
//  */
// const AllMode: Record<ModeName, {
//     cursor: CursorName;
//     tools: ToolName[];
//     layer?: () => ComponentWithData;
// }> = {
//     select: {
//         cursor: "select",
//         tools: ["select", "pan", "pan"], // Left: select/frame/move, Middle: pan, Right: pan
//         layer: () => componentWithData(SelectLayer, {})
//     },
//     draw: {
//         cursor: "pencil",
//         tools: ["brush", "pan", "erase"] // Left: draw, Middle: pan, Right: erase
//     },
//     eraser: {
//         cursor: "eraser",
//         tools: ["erase", "pan", "pan"]
//     },
//     hand: {
//         cursor: "grab",
//         tools: ["pan", "pan", "pan"]
//     }
// };

// /**
//  * Implementation of each Tool's logic.
//  * This registry contains the actual behavior for every interaction state.
//  */
// const AllTool: { [T in ToolName]: ToolFunction<T> } = {
//     select: {
//         onDown: (mode, coords, app) => {
//             const hit = app.elements.findElementAt(coords.canvas);
//             app.selection.editingText = null;

//             if (hit) {
//                 // Dragging existing selection or a new single element
//                 if (!app.selection.selectedElements.includes(hit)) {
//                     app.selection.clearSelection();
//                     app.selection.select(hit);
//                 }
//                 mode.tool = {
//                     type: "select",
//                     action: {
//                         type: "move",
//                         targets: app.selection.selectedElements.map(el => ({ el, startPos: el.position })),
//                         startMousePos: coords.canvas
//                     }
//                 };
//             } else {
//                 // Clear and start frame selection
//                 app.selection.clearSelection();
//                 mode.tool = {
//                     type: "select",
//                     action: {
//                         type: "frame",
//                         startPos: coords.canvas,
//                         endPos: coords.canvas
//                     }
//                 };
//             }
//         },
//         onMove: (mode, coords, app) => {
//             if (mode.tool.action.type === "frame") {
//                 mode.tool.action.endPos = coords.canvas;
//                 const frame = Rect.fromPoints(mode.tool.action.startPos, mode.tool.action.endPos);
//                 const elementsInRect = app.elements.getElementsByRect(frame);
//                 app.selection.setSelection(elementsInRect);
//             } else {
//                 const action = mode.tool.action;
//                 const delta = Vec2.subtract(coords.canvas, action.startMousePos);
//                 for (const item of action.targets) {
//                     item.el.position = Vec2.add(item.startPos, delta);
//                 }
//             }
//         },
//         onUp: (mode, coords, app) => {
//             if (mode.tool.action.type === "move") {
//                 const action = mode.tool.action;
//                 // Handle clicking text elements for editing
//                 const delta = Vec2.distance(coords.canvas, action.startMousePos);
//                 if (delta < 5) { // Small threshold for "click" instead of "drag"
//                     if (app.selection.selectedElements.length === 1 && app.selection.selectedElements[0] instanceof TextElement) {
//                         app.selection.editingText = app.selection.selectedElements[0] as TextElement;
//                     }
//                 }
//             }
//         },
//         layer: (tool) => {
//             if (tool.action.type !== "frame") return;
//             return componentWithData(FrameLayer, { frame: Rect.fromPoints(tool.action.startPos, tool.action.endPos) });
//         }
//     },
//     brush: {
//         cursor: "pencil",
//         onDown: (mode, coords, app) => {
//             const element = new StrokeElement(
//                 coords.canvas,
//                 [Vec2.zero()],
//                 "M0,0Z",
//                 app.styleManager.color,
//                 app.styleManager.size,
//                 Rect.new(-5, -5, 5, 5) // Initial bounding box
//             );
//             app.elements.addElement(element);
//             mode.tool = { type: "brush", element, initialCoords: coords.canvas };
//         },
//         onMove: (mode, coords) => {
//             const tool = mode.tool;
//             const pointOffset = Vec2.subtract(coords.canvas, tool.initialCoords);
//             tool.element.points.push(pointOffset);
//             tool.element.boundingBox = Rect.expand(tool.element.boundingBox, pointOffset);
//             tool.element.path = getSvgPathFromVec2Points(tool.element.points);
//         },
//         onUp: () => {
//         }
//     },
//     erase: {
//         cursor: "eraser",
//         onDown: (mode, coords, app) => {
//             app.trail.addPoint(coords.canvas);
//             app.elements.filterUpElements(el => !el.hitTest(coords.canvas));
//             mode.tool = { type: "erase", prevCoords: coords.canvas };
//         },
//         onMove: (mode, coords, app) => {
//             app.trail.addPoint(coords.canvas);
//             app.elements.filterUpElements(el => !el.hitTest(coords.canvas));
//         },
//         onUp: () => {
//             // Eraser trail naturally fades or stops when tool is idle
//         }
//     },
//     pan: {
//         cursor: "grabbing",
//         onDown: (mode, coords) => {
//             mode.tool = { type: "pan", prevCoords: coords.screen };
//         },
//         onMove: (mode, coords, app) => {
//             const tool = mode.tool;
//             const displacement = Vec2.subtract(tool.prevCoords, coords.screen);
//             app.camera.moveBy(displacement);
//             tool.prevCoords = coords.screen;
//         },
//         onUp: () => {
//         }
//     },
//     idle: {
//         onDown: () => { },
//         onMove: () => { },
//         onUp: () => { }
//     }
// };

// // --- Toolbox Class ---

// /**
//  * The Toolbox manager coordinates Mode and Tool state based on user input.
//  * It uses a data-driven pattern where AllMode and AllTool registries provide logic.
//  */

type ModeName = "select" | "draw" | "eraser" | "hand";

export class Toolbox {

    static readonly AllMode = {
        select: SelectMode,
        draw: DrawMode,
        eraser: EraseMode,
        hand: HandMode
    };

    private readonly app: ManagerProvider;
    private mode: Mode;
    private activeTool: Tool | undefined = $state();

    constructor(app: ManagerProvider, defaultModeName: ModeName = "select") {
        this.app = app;
        this.mode = $state(new Toolbox.AllMode[defaultModeName]());
    }

    private getMouseCoords(event: MouseEvent | WheelEvent): MouseCoords {
        const screenCoords = Vec2.new(event.clientX, event.clientY);
        const canvasCoords = this.app.camera.toCanvasCoords(screenCoords);
        return { canvas: canvasCoords, screen: screenCoords };
    }

    getCursorStyle() {
        const cursorName = this.activeTool?.cursor ?? this.mode.idleCursor;
        return Cursor.getStyle(cursorName);
    }

    getModeName() {
        return this.mode.type;
    }

    isIdle() {
        return !this.activeTool;
    }

    getRenderLayers(): ComponentWithData[] {
        const layers: ComponentWithData[] = [];

        const modeLayer = this.mode.modeLayer;
        if (modeLayer) layers.push(modeLayer);
        const toolLayer = this.activeTool?.layer;
        if (toolLayer) layers.push(toolLayer);

        return layers;
    }

    switchMode(mode: ModeName) {
        this.mode = new Toolbox.AllMode[mode]();
        this.activeTool = undefined;
    }

    onPointerDown(event: PointerEvent) {
        const coords = this.getMouseCoords(event);

        if (event.button === 1) { // Middle button
            this.activeTool = this.mode.getSecondaryTool?.(coords, this.app);
        } else if (event.button === 2) { // Right button
            this.activeTool = this.mode.getTertiaryTool?.(coords, this.app);
        } else { // Left button
            this.activeTool = this.mode.getPrimaryTool(coords, this.app);
        }
    }

    onPointerMove(event: PointerEvent) {
        this.activeTool?.onMove(this.getMouseCoords(event), this.app);
    }

    onPointerUp(event: PointerEvent) {
        this.activeTool?.onUp?.(this.getMouseCoords(event), this.app);
        this.activeTool = undefined;
    }

    onWheel(event: WheelEvent) {
        event.preventDefault();
        const scale = event.deltaY < 0 ? 1.25 : 0.8;
        this.app.camera.zoomAt(this.getMouseCoords(event).screen, scale);
    }

    onContextMenu(event: MouseEvent) {
        event.preventDefault();
    }
}
