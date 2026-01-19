import type { Component } from "svelte";
import type { Rect, Vec2 } from "../math/vector";

export interface ElementProvider extends Iterable<Element> {
    // return the svelte-proxied element (will forward changes)
    addElement<T extends Element>(element: T): T;
    filterUpElements(predicate: (element: Element) => unknown): void;
    findElement(predicate: (element: Element) => unknown): Element | undefined;
    findElements(predicate: (element: Element) => unknown): Element[];
    findElementAt(pos: Vec2): Element | undefined;
    getElementsByRect(frame: Rect): Element[];
}

export interface Element {
    readonly type: string;
    readonly component: Component<{ object: any; }>;
    readonly componentHighlight: Component<{ object: any; }>;
    readonly id: string;
    position: Vec2;
    boundingBox: Rect;
    hitTest: (pos: Vec2) => boolean;
    frameTest: (frame: Rect) => boolean;
};
