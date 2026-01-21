import type { Component } from "svelte";
import type { Rect, Vec2 } from "../math/vector";
import type { StyleManager } from "../manager/style_manager.svelte";
import type { Camera } from "../manager/camera.svelte";
import type { TrailManager } from "../manager/trail_manager.svelte";

export interface ElementProvider extends Iterable<Element> {
    // return the svelte-proxied element (will forward changes)
    addElement<T extends Element>(element: T): T;
    filterUpElements(predicate: (element: Element) => unknown): void;
    findElement(predicate: (element: Element) => unknown): Element | undefined;
    findElements(predicate: (element: Element) => unknown): Element[];
    findElementAt(pos: Vec2): Element | undefined;
    getElementsByRect(frame: Rect): Element[];
}

export interface ManagerProvider {
    readonly elements: ElementProvider;
    readonly camera: Camera;
    readonly styleManager: StyleManager;
    readonly trail: TrailManager;
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
