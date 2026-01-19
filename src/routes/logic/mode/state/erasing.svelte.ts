import type { ManagerProvider } from "../../interface/interface";
import type { ModeState, MouseCoords } from "../state.svelte";

export function erasingState(app: ManagerProvider, coords: MouseCoords): ModeState {
    app.trail.addPoint(coords.canvas);

    app.elements.filterUpElements(el => !el.hitTest(coords.canvas));
    const onMove = (coords: MouseCoords) => {
        app.trail.addPoint(coords.canvas);
        app.elements.filterUpElements(el => !el.hitTest(coords.canvas));
    };

    const destroy = () => { };

    return { cursor: "eraser", onMove, destroy };
}
