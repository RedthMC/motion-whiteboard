import type { ManagerProvider } from "../../interface/interface";
import { Vec2, Rect } from "../../math/vector";
import { TextElement } from "../../element/text/text_element.svelte";
import type { ModeState, MouseCoords } from "../state.svelte";

export class FramingState implements ModeState {
    readonly cursor = "select";
    private readonly frameStart: Vec2;
    private readonly app: ManagerProvider;
    constructor(app: ManagerProvider, coords: MouseCoords) {
        this.app = app;
        this.frameStart = coords.canvas;
        this.selectionFrame = $state(Rect.fromPoints(coords.canvas, coords.canvas));
    }
    selectionFrame: Rect;
    onMove(coords: MouseCoords) {
        this.selectionFrame = Rect.fromPoints(this.frameStart, coords.canvas);
        const elementsInRect = this.app.elements.getElementsByRect(this.selectionFrame);
        this.app.selection.setSelection(elementsInRect);
    }
    destroy() { }
}

export function selectingState(app: ManagerProvider, coords: MouseCoords): ModeState & { selectionFrame?: Rect; } {
    const hit = app.elements.findElementAt(coords.canvas);
    app.selection.editingText = null;

    if (!hit) { // Frame selection if no hits
        app.selection.clearSelection();
        return new FramingState(app, coords);
    }

    // If hit element is NOT already selected, select only it.
    if (!app.selection.selectedElements.includes(hit)) {
        app.selection.clearSelection();
        app.selection.select(hit);
    }

    const dragInfo = {
        elements: app.selection.selectedElements.map(el => ({
            el,
            startPos: el.position
        })),
        startMousePos: coords.canvas
    };

    const onMove = (coords: MouseCoords) => {
        const delta = Vec2.subtract(coords.canvas, dragInfo.startMousePos);
        for (const item of dragInfo.elements) {
            item.el.position = Vec2.add(item.startPos, delta);
        }
    };

    const destroy = () => {
        // If only one hit element and it is text
        if (app.selection.selectedElements.length === 1 && app.selection.selectedElements[0] instanceof TextElement) {
            app.selection.editingText = app.selection.selectedElements[0] as TextElement;
        }
    };
    return { cursor: "select", onMove, destroy };
}
