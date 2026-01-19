import { Rect, Vec2 } from "../math/vector";
import type { Element, ElementProvider } from "../interface/interface";

export class ElementManager implements ElementProvider {
    private elements: Element[] = $state([]);

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
        return this.elements.findLast((el) => el.hitTest(pos));
    }

    getElementsByRect(frame: Rect): Element[] {
        return this.elements.filter((el) => el.frameTest(frame));
    }

}
