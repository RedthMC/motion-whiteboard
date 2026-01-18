import { Camera } from "./camera.svelte";
import { Cursor } from "./cursors.svelte";
import type { Element } from "./elements";
import { Pan, type Tool, Brush, Eraser } from "./tool.svelte";
import { Vec2 } from "./vector";

const LEFT_MOUSE_BUTTON = 0;
const MID_MOUSE_BUTTON = 1;

export class AppState {
    readonly elements = new ElementManager();
    readonly camera = new Camera();
    readonly styleManager = new StyleManager();

    private readonly tools = {
        pan: new Pan(this.camera),
        brush: new Brush(this.elements, this.styleManager),
        eraser: new Eraser(this.elements),
    };

    currentTool: keyof typeof this.tools = $state("brush");
    activeTool: Tool | null = $state(null);

    readonly cursor = new Cursor(this);

    private getMouseCoords(event: MouseEvent): MouseCoords {
        const screenCoords = { x: event.clientX, y: event.clientY };
        const canvasCoords = this.camera.toCanvasCoords(screenCoords);
        return { canvas: canvasCoords, screen: screenCoords };
    }

    switchTool(toolName: keyof typeof this.tools) {
        this.currentTool = toolName;
    }

    onPointerDown(event: PointerEvent) {
        if (event.button === LEFT_MOUSE_BUTTON) {
            this.activeTool = this.tools[this.currentTool];
            this.activeTool.onDown(this.getMouseCoords(event));
        } else if (event.button === MID_MOUSE_BUTTON) {
            this.activeTool = this.tools.pan;
            this.activeTool.onDown(this.getMouseCoords(event));
        }
    }

    onPointerMove(event: PointerEvent) {
        if (!this.activeTool) return;
        this.activeTool.onMove(this.getMouseCoords(event));
    }

    onPointerUp(event: PointerEvent) {
        if (!this.activeTool) return;
        this.activeTool.onUp(this.getMouseCoords(event));
        this.activeTool = null;
    }

    onWheel(event: WheelEvent) {
        event.preventDefault(); // prevent browser ctrl+scroll
        const scale = event.deltaY < 0 ? 1.25 : 0.8;
        this.camera.zoomAt(this.getMouseCoords(event).screen, scale);
    }

    onContextMenu(event: MouseEvent) {
        event.preventDefault();
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

export class StyleManager {
    style = $state({
        color: "#000000",
        size: 3,
    });

    readonly colors = [
        "#000000",
        "#9ca3af",
        "#e879f9",
        "#a855f7",
        "#3b82f6",
        "#0ea5e9",
        "#f59e0b",
        "#f97316",
        "#098d44",
        "#22c55e",
        "#f08193",
        "#ef4444",
    ];
}

export type MouseCoords = {
    canvas: Vec2;
    screen: Vec2;
};
