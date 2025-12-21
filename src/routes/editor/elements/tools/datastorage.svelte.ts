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
        this.toolManager = new ToolManager(this);
        this.inputHandler = new InputHandler(this);
    }
}

class ElementManager implements Iterable<Element> {
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
export type InputEventCallback<T extends Event> = (event: T) => void;

class InputHandler {
    readonly app: AppStateManager;
    private subscribers: Map<InputEventType, Set<InputEventCallback<any>>> = new Map();

    constructor(app: AppStateManager) {
        this.app = app;
    }

    private getMousePos(event: PointerEvent): MousePos {
        const mouseRawPos = { x: event.pageX, y: event.pageY };
        const mousePosOnCanvas = this.app.camera.mapScreenPositionToCanvas(mouseRawPos);
        return { mousePosOnCanvas, mouseRawPos };
    }

    subscribe<T extends Event>(type: InputEventType, callback: InputEventCallback<T>): () => void {
        if (!this.subscribers.has(type)) {
            this.subscribers.set(type, new Set());
        }
        this.subscribers.get(type)!.add(callback);

        return () => {
            const callbacks = this.subscribers.get(type);
            if (callbacks) {
                callbacks.delete(callback);
                if (callbacks.size === 0) {
                    this.subscribers.delete(type);
                }
            }
        };
    }

    private notifySubscribers(type: InputEventType, event: Event) {
        const callbacks = this.subscribers.get(type);
        if (callbacks) {
            callbacks.forEach(callback => callback(event));
        }
    }

    onPointerDown(event: PointerEvent) {
        this.app.toolManager.onMouseDown(event.button, this.getMousePos(event));
        this.notifySubscribers("pointerdown", event);
        console.log("down", event.button);
    }

    onPointerMove(event: PointerEvent) {
        this.app.toolManager.onMouseMove(event.button, this.getMousePos(event));
        this.notifySubscribers("pointermove", event);
    }

    onPointerUp(event: PointerEvent) {
        this.app.toolManager.onMouseUp(event.button, this.getMousePos(event));
        this.notifySubscribers("pointerup", event);
        console.log("up", event.button);
    }

    onWheel(event: WheelEvent) {
        event.preventDefault(); // prevent browser ctrl+scroll
        this.app.toolManager.processZoom(event.pageX, event.pageY, event.deltaY);
        this.notifySubscribers("wheel", event);
    }

    onContextMenu(event: MouseEvent) {
        event.preventDefault();
    }
}

