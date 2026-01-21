import { componentWithData, createTool, type ComponentWithData, type Mode, type MouseCoords, type Tool } from "./mode.svelte";
import type { Element, ManagerProvider } from "../interface/interface";
import { Rect, Vec2 } from "../math/vector";
import { TextElement } from "../element/text/text_element.svelte";
import { Pan } from "./pan.svelte";
import FrameLayer from "../../ui/layers/FrameLayer.svelte";
import SelectLayer from "../../ui/layers/SelectLayer.svelte";

export class SelectMode implements Mode {
    readonly type = "select";
    readonly idleCursor = "select";
    selectedElements: Element[] = $state([]);
    editingText: TextElement | null = $state(null);
    readonly modeLayer = componentWithData(SelectLayer, { selection: this });

    selectedFrame: Rect | null = $derived.by(() => {
        if (this.selectedElements.length === 0) return null;
        return this.selectedElements
            .map(el => Rect.add(el.boundingBox, el.position))
            .reduce((a, b) => Rect.merge(a, b));
    });

    setSelection(elements: Element[]) {
        this.selectedElements = elements;
    }

    select(element: Element) {
        if (!this.selectedElements.includes(element)) {
            this.selectedElements.push(element);
        }
    }

    deselect(element: Element) {
        const index = this.selectedElements.indexOf(element);
        if (index !== -1) {
            this.selectedElements.splice(index, 1);
        }
    }

    clearSelection() {
        this.selectedElements = [];
        this.editingText = null;
    }

    getPrimaryTool(coords: MouseCoords, app: ManagerProvider) {
        this.editingText = null;

        const hit = app.elements.findElementAt(coords.canvas);
        if (!hit) return new FrameTool(this, coords, app); // Frame selection if no hits
        return new MoveTool(this, hit, coords, app);
    }

    getSecondaryTool = createTool(Pan);
}

export class MoveTool implements Tool {
    readonly type = "move";
    readonly cursor = "select";
    selection: SelectMode;
    draggedElements: { el: Element, startPos: Vec2; }[];
    startMousePos: Vec2;

    constructor(selection: SelectMode, hit: Element, coords: MouseCoords, app: ManagerProvider) {
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
        if (this.selection.selectedElements.length === 1 && this.selection.selectedElements[0] instanceof TextElement) {
            this.selection.editingText = this.selection.selectedElements[0];
        }
    }
}


class FrameTool implements Tool {
    readonly type = "frame";
    readonly cursor = "select";
    readonly frameStart: Vec2;
    readonly layer: ComponentWithData;
    readonly selection: SelectMode;
    selectionFrame: Rect;

    constructor(selection: SelectMode, coords: MouseCoords, app: ManagerProvider) {
        this.selection = selection;
        this.frameStart = coords.canvas;
        this.selectionFrame = $state(Rect.fromPoints(coords.canvas, coords.canvas));
        this.layer = $derived(componentWithData(FrameLayer, { frame: this.selectionFrame }));
    }

    onMove(coords: MouseCoords, app: ManagerProvider) {
        this.selectionFrame = Rect.fromPoints(this.frameStart, coords.canvas);
        const elementsInRect = app.elements.getElementsByRect(this.selectionFrame);
        this.selection.setSelection(elementsInRect);
    };
}

