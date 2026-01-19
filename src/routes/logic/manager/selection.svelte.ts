import { Rect, Vec2 } from "../math/vector";
import type { Element } from "../interface/interface";
import type { TextElement } from "../element/text/text_element.svelte";

export class SelectionManager {
    selectedElements: Element[] = $state([]);
    editingText: TextElement | null = $state(null);

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
}
