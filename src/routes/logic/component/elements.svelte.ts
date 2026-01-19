import { getSvgPathFromStrokePoints } from "../math/stroke";
import { Rect, Vec2 } from "../math/vector";

export class ElementManager implements Iterable<Element> {
    elements: Element[] = $state([]);
    selectedElements: Element[] = $state([]);

    [Symbol.iterator]() {
        return this.elements[Symbol.iterator]();
    }

    // return the svelte-proxied element (will forward changes)
    addElement<T extends Element>(element: T): T {
        this.elements.push(element);
        return this.elements.at(-1) as T;
    }

    filterUpElements(predicate: (element: Element) => unknown) {
        this.elements = this.elements.filter(predicate);
    }

    findElement(predicate: (element: Element) => unknown) {
        return this.elements.find(predicate);
    }

    findElements(predicate: (element: Element) => unknown) {
        return this.elements.filter(predicate);
    }

    findElementAt(pos: Vec2): Element | undefined {
        return this.findElement((el) => {
            if (el.type === "stroke") {
                const relativePos = Vec2.subtract(pos, el.position);
                return Rect.inRect(el.boundingBox, relativePos);
            }
            return false;
        });
    }

    select(element: Element) {
        this.selectedElements.push(element);

    }

    deselect(element: Element) {
        this.selectedElements.splice(this.selectedElements.indexOf(element), 1);
    }

    clearSelection() {
        this.selectedElements = [];
    }
}

export type Element = Stroke | Text;

export type BaseElement = {
    id: string,
    position: Vec2,
    boundingBox: Rect,
};

export type Stroke = BaseElement & {
    type: "stroke",
    path: string,
    color: string,
    size: number,
};
export const Stroke = {
    toSvgPath: (points: Vec2[]): string => getSvgPathFromStrokePoints(points),
};

export type Text = BaseElement & {
    type: "text",
    text: string,
};

