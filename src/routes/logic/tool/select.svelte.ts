import { componentWithData, createTool, type ComponentWithData, type Mode, type MouseCoords, type Tool } from "./mode.svelte";
import type { SelectionManager } from "../manager/selection.svelte";
import type { Element, ManagerProvider } from "../interface/interface";
import { Rect, Vec2 } from "../math/vector";
import { TextElement } from "../element/text/text_element.svelte";
import { Pan } from "./pan.svelte";
import FrameLayer from "../../ui/layers/FrameLayer.svelte";
import SelectLayer from "../../ui/layers/SelectLayer.svelte";

export class SelectMode implements Mode {
    readonly type = "select";
    readonly idleCursor = "select";
    readonly modeLayer = componentWithData(SelectLayer, {});
    selection: SelectionManager | null = $state(null);

    getPrimaryTool(coords: MouseCoords, app: ManagerProvider) {
        app.selection.editingText = null;

        const hit = app.elements.findElementAt(coords.canvas);
        if (!hit) return new FrameTool(coords, app); // Frame selection if no hits

        this.selection = app.selection;
        return new MoveTool(this.selection, hit, coords, app);
    }

    getSecondaryTool = createTool(Pan);
}

export class MoveTool implements Tool {
    readonly type = "move";
    readonly cursor = "select";
    selection: SelectionManager;
    draggedElements: { el: Element, startPos: Vec2; }[];
    startMousePos: Vec2;

    constructor(selection: SelectionManager, hit: Element, coords: MouseCoords, app: ManagerProvider) {
        this.selection = selection;

        if (!this.selection.selectedElements.includes(hit)) {
            this.selection.clearSelection();
            this.selection.select(hit);
        }

        this.draggedElements = this.selection.selectedElements.map(el => ({ el, startPos: el.position }));
        this.startMousePos = coords.canvas;
    };

    onMove(coords: MouseCoords, app: ManagerProvider) {
        const delta = Vec2.subtract(coords.canvas, this.startMousePos);
        for (const item of this.draggedElements) {
            item.el.position = Vec2.add(item.startPos, delta);
        }
    };

    onUp(coords: MouseCoords, app: ManagerProvider) {
        // If only one hit element and it is text
        if (app.selection.selectedElements.length === 1 && app.selection.selectedElements[0] instanceof TextElement) {
            app.selection.editingText = app.selection.selectedElements[0];
        }
    }
}


class FrameTool implements Tool {
    readonly type = "frame";
    readonly cursor = "select";
    readonly frameStart: Vec2;
    readonly layer: ComponentWithData;
    selectionFrame: Rect;

    constructor(coords: MouseCoords, app: ManagerProvider) {
        this.frameStart = coords.canvas;
        this.selectionFrame = $state(Rect.fromPoints(coords.canvas, coords.canvas));
        this.layer = $derived(componentWithData(FrameLayer, { frame: this.selectionFrame }));
    }


    onMove(coords: MouseCoords, app: ManagerProvider) {
        this.selectionFrame = Rect.fromPoints(this.frameStart, coords.canvas);
        const elementsInRect = app.elements.getElementsByRect(this.selectionFrame);
        app.selection.setSelection(elementsInRect);
    };
}

