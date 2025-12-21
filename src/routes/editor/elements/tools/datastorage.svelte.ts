import type { Element } from "../elements";
import { Camera } from "./camera.svelte";
import { ToolManager, type MousePos } from "./tools.svelte";

export class AppStateManager {
    camera: Camera;
    elementManager: ElementManager;
    toolManager: ToolManager;
    inputHandler: InputHandler;

    constructor() {
        this.camera = new Camera();
        this.elementManager = new ElementManager();
        this.inputHandler = new InputHandler(this.camera);
        this.toolManager = new ToolManager(this.camera, this.inputHandler, this.elementManager);


    }
}

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


export type InputEventType = "pointerdown" | "pointermove" | "pointerup" | "wheel";
export type InputEventCallback<T extends InputEvent> = (event: T) => void;

export type PointerWheelEvent = {
    type: "wheel";
    mousePos: MousePos;
    deltaY: number;
};


export type PointerDownEvent = {
    type: "pointerdown";
    button: number;
    mousePos: MousePos;
};

export type PointerMoveEvent = {
    type: "pointermove";
    button: number;
    mousePos: MousePos;
};

export type PointerUpEvent = {
    type: "pointerup";
    button: number;
    mousePos: MousePos;
};


export type InputEvent = PointerDownEvent | PointerMoveEvent | PointerUpEvent | PointerWheelEvent;

export class InputHandler {
    private readonly camera: Camera;
    private subscribers: Map<InputEventType, Set<InputEventCallback<any>>> = new Map();

    constructor(camera: Camera) {
        this.camera = camera;
    }

    private getMousePos(event: MouseEvent): MousePos {
        const mouseRawPos = { x: event.clientX, y: event.clientY };
        const mousePosOnCanvas = this.camera.mapScreenPositionToCanvas(mouseRawPos);
        return { onCanvas: mousePosOnCanvas, raw: mouseRawPos };
    }

    subscribe<T extends InputEvent>(type: InputEventType, callback: InputEventCallback<T>): () => void {
        let callbacks = this.subscribers.get(type);
        if (!callbacks) {
            callbacks = new Set();
            this.subscribers.set(type, callbacks);
        }
        callbacks.add(callback);

        return () => { // unsubscribe
            const callbacks = this.subscribers.get(type);
            if (!callbacks) {
                return;
            }
            callbacks.delete(callback);
            if (callbacks.size === 0) {
                this.subscribers.delete(type);
            }
        };
    }

    private notifySubscribers(event: InputEvent) {
        const callbacks = this.subscribers.get(event.type);
        if (callbacks) {
            callbacks.forEach(callback => callback(event));
        }
    }

    onPointerDown(event: PointerEvent) {
        this.notifySubscribers({
            type: "pointerdown",
            button: event.button,
            mousePos: this.getMousePos(event),
        });
        console.log("down", event.button);
    }

    onPointerMove(event: PointerEvent) {
        this.notifySubscribers({
            type: "pointermove",
            button: event.button,
            mousePos: this.getMousePos(event),
        });
    }

    onPointerUp(event: PointerEvent) {
        this.notifySubscribers({
            type: "pointerup",
            button: event.button,
            mousePos: this.getMousePos(event),
        });
        console.log("up", event.button);
    }

    onWheel(event: WheelEvent) {
        event.preventDefault(); // prevent browser ctrl+scroll
        this.notifySubscribers({
            type: "wheel",
            mousePos: this.getMousePos(event),
            deltaY: event.deltaY,
        });
    }

    onContextMenu(event: MouseEvent) {
        event.preventDefault();
    }
}

