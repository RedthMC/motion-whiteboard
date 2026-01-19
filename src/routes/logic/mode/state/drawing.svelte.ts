import type { ManagerProvider } from "../../interface/interface";
import { getSvgPathFromVec2Points } from "../../math/stroke";
import type { ModeState, MouseCoords } from "../state.svelte";
import { Vec2, Rect } from "../../math/vector";
import { StrokeElement } from "../../element/stroke/stroke_element.svelte";

export function drawingState(app: ManagerProvider, mouse: MouseCoords): ModeState {
    const initialCoords = mouse.canvas;
    const drawingStroke = app.elements.addElement(new StrokeElement(
        mouse.canvas,
        [Vec2.zero()],
        "M0,0Z",
        app.styleManager.color,
        app.styleManager.size,
        Rect.new(-5, -5, 5, 5), // TODO: base on stroke width
    ));

    const onMove = (coords: MouseCoords) => {
        const pointOffset = Vec2.subtract(coords.canvas, initialCoords);
        drawingStroke.points.push(pointOffset);
        drawingStroke.boundingBox = Rect.expand(drawingStroke.boundingBox, pointOffset);
        drawingStroke.path = getSvgPathFromVec2Points(drawingStroke.points);
    };

    const destroy = () => { };

    return { cursor: "pencil", onMove, destroy };
}
