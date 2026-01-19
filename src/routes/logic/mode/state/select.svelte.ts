import type { ManagerProvider } from "../../interface/interface";
import { Vec2, Rect } from "../../math/vector";
import { TextElement } from "../../element/text/text_element.svelte";
import { componentWithData, type ToolState, type MouseCoords } from "../state.svelte";
import FrameLayer from "../../../ui/layers/FrameLayer.svelte";

export function selectingTool(app: ManagerProvider, coords: MouseCoords): ToolState {
    const hit = app.elements.findElementAt(coords.canvas);
    app.selection.editingText = null;

    if (!hit) { // Frame selection if no hits
        app.selection.clearSelection();

        const frameStart = coords.canvas;
        let selectionFrame = $state(Rect.fromPoints(coords.canvas, coords.canvas));
        const layer = () => componentWithData(FrameLayer, { frame: selectionFrame });

        const onMove = (coords: MouseCoords) => {
            selectionFrame = Rect.fromPoints(frameStart, coords.canvas);
            const elementsInRect = app.elements.getElementsByRect(selectionFrame);
            app.selection.setSelection(elementsInRect);
        };

        return { cursor: "select", onMove, layer };
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
