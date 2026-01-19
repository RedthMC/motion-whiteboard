import { type CanvasTool, type MouseCoords } from "./tools.svelte";
import type { StyleManager } from "../manager/style_manager.svelte";
import { getSvgPathFromVec2Points } from "../math/stroke";
import { Vec2, Rect } from "../math/vector";
import type { ElementProvider } from "../interface/interface";
import { StrokeElement } from "../element/stroke/stroke_element.svelte";

export class Brush implements CanvasTool {
    private readonly elements: ElementProvider;
    private readonly styleManager: StyleManager;

    constructor(elements: ElementProvider, styleManager: StyleManager) {
        this.elements = elements;
        this.styleManager = styleManager;
    }

    readonly cursor = "pencil";

    private drawingStroke: { initialCoords: Vec2, points: Vec2[], stroke: StrokeElement; } | null = $state(null);

    onDown(coords: MouseCoords) {
        this.drawingStroke = {
            initialCoords: coords.canvas,
            points: [{ x: 0, y: 0 }],
            stroke: this.elements.addElement(new StrokeElement(
                coords.canvas,
                [{ x: 0, y: 0 }],
                "M0,0Z",
                this.styleManager.color,
                this.styleManager.size,
                { left: -5, top: -5, right: 5, bottom: 5 }, // TODO: base on stroke width
            )),
        };
    }

    onMove(coords: MouseCoords) {
        if (!this.drawingStroke) return; // "drawingStroke is null" means "mouse is not down"

        const pointOffset = Vec2.subtract(coords.canvas, this.drawingStroke.initialCoords);
        this.drawingStroke.points.push(pointOffset);
        this.drawingStroke.stroke.boundingBox = Rect.expand(this.drawingStroke.stroke.boundingBox, pointOffset);
        this.drawingStroke.stroke.path = getSvgPathFromVec2Points(this.drawingStroke.points);
    }

    onUp(coords: MouseCoords) {
        this.drawingStroke = null;
    }
}
