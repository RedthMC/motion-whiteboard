import { Vec2 } from "../../math/vector";
import type { ManagerProvider } from "../../interface/interface";
import type { ModeState, MouseCoords } from "../state.svelte";

export function panningState(app: ManagerProvider, mouse: MouseCoords): ModeState {
    let prevCoordsScreen = mouse.screen;

    const onMove = (coords: MouseCoords) => {
        const displacement = Vec2.subtract(prevCoordsScreen, coords.screen);
        app.camera.moveBy(displacement);
        prevCoordsScreen = coords.screen;
    };

    const destroy = () => { };

    return { cursor: "grabbing", onMove, destroy };
}
