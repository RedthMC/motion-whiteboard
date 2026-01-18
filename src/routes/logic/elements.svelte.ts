import { getSvgPathFromStrokePoints } from "./math/stroke";
import { Rect, type Vec2 } from "./math/vector";

export class ElementManager implements Iterable<Element> {
    elements: Element[] = $state([]);

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
}

export type Element = Stroke | Text;

export type Stroke = {
    id: string,
    type: "stroke",
    position: Vec2,
    path: string,
    boundingBox: Rect,
    color: string,
    size: number,
};
export const Stroke = {
    toSvgPath: (points: Vec2[]): string => getSvgPathFromStrokePoints(points),
};

export type Text = {
    id: string,
    type: "text",
    text: "",
};

