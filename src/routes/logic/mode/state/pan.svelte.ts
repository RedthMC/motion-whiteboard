import { Vec2 } from "../../math/vector";
import type { ManagerProvider } from "../../interface/interface";
import type { ToolState, MouseCoords } from "../state.svelte";

export function panningTool(app: ManagerProvider, mouse: MouseCoords): ToolState {
    let prevCoordsScreen = mouse.screen;
    const onMove = (coords: MouseCoords) => {
        const displacement = Vec2.subtract(prevCoordsScreen, coords.screen);
        app.camera.moveBy(displacement);
        prevCoordsScreen = coords.screen;
    };
    return { cursor: "grabbing", onMove };
}
