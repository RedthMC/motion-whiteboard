import type { ManagerProvider } from "../../interface/interface";
import type { ToolState, MouseCoords } from "../state.svelte";

export function eraserTool(app: ManagerProvider, coords: MouseCoords): ToolState {
    app.trail.addPoint(coords.canvas);

    app.elements.filterUpElements(el => !el.hitTest(coords.canvas));
    const onMove = (coords: MouseCoords) => {
        app.trail.addPoint(coords.canvas);
        app.elements.filterUpElements(el => !el.hitTest(coords.canvas));
    };
    return { cursor: "eraser", onMove };
}
