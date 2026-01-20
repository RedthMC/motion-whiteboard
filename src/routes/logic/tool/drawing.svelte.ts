import { createTool, type Mode, type MouseCoords, type Tool } from "./mode.svelte";
import { Vec2 } from "../math/vector";
import type { ManagerProvider } from "../interface/interface";
import { Rect } from "../math/vector";
import { getSvgPathFromVec2Points } from "../math/stroke";
import { StrokeElement } from "../element/stroke/stroke_element.svelte";
import { Eraser } from "./erasing.svelte";
import { Pan } from "./pan.svelte";

export class DrawMode implements Mode {
    readonly type = "draw";
    readonly idleCursor = "pencil";
    readonly modeLayer = undefined;

    getPrimaryTool = createTool(Brush);
    getSecondaryTool = createTool(Pan);
    getTertiaryTool = createTool(Eraser);
}

export class Brush implements Tool {
    readonly type = "brush";
    readonly cursor = "pencil";
    readonly initialCoords: Vec2;
    readonly drawingStroke: StrokeElement;

    constructor(coords: MouseCoords, app: ManagerProvider) {
        this.initialCoords = coords.canvas;
        this.drawingStroke = app.elements.addElement(new StrokeElement(
            coords.canvas,
            [Vec2.zero()],
            "M0,0Z",
            app.styleManager.color,
            app.styleManager.size,
            Rect.new(-5, -5, 5, 5), // TODO: base on stroke width
        ));
    };

    onMove(coords: MouseCoords, app: ManagerProvider) {
        const pointOffset = Vec2.subtract(coords.canvas, this.initialCoords);
        this.drawingStroke.points.push(pointOffset);
        this.drawingStroke.boundingBox = Rect.expand(this.drawingStroke.boundingBox, pointOffset);
        this.drawingStroke.path = getSvgPathFromVec2Points(this.drawingStroke.points);
    };
}