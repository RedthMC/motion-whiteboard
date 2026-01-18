import type { Camera } from "./camera.svelte";
import type { InputEventType } from "./datastorage.svelte";
import type { MousePos } from "./tools.svelte";


export class Pipeline<T, U> {
    private readonly step: ((input: T) => U);
    private constructor(step: ((input: T) => U)) {
        this.step = step;
    }

    static of<T, U>(step: ((input: T) => U)) {
        return new Pipeline(step);
    }

    then<V>(nextStep: (input: U) => V) {
        return Pipeline.of((input: T) => nextStep(this.step(input)));
    }

    process(input: T): U {
        return this.step(input);
    }
}

export class InputHandler {
    private readonly camera: Camera;
    constructor(camera: Camera) {
        this.camera = camera;
    }

    private getMousePos(event: MouseEvent): MousePos {
        const mouseRawPos = { x: event.clientX, y: event.clientY };
        const mousePosOnCanvas = this.camera.mapScreenPositionToCanvas(mouseRawPos);
        return { onCanvas: mousePosOnCanvas, raw: mouseRawPos };
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

function TODO<T>(): T {
    throw new Error("Not implemented");
}

const camera: Camera = TODO();

function getMousePos(event: MouseEvent): MousePos {
    const mouseRawPos = { x: event.clientX, y: event.clientY };
    const mousePosOnCanvas = camera.mapScreenPositionToCanvas(mouseRawPos);
    return { onCanvas: mousePosOnCanvas, raw: mouseRawPos };
}


function pointerDownEvent(event: PointerEvent) {
    return {
        type: "pointerdown",
        button: event.button,
        mousePos: getMousePos(event),
    };
}

function pointerMoveEvent(event: PointerEvent) {
    return {
        type: "pointermove",
        button: event.button,
        mousePos: getMousePos(event),
    };
}

function pointerUpEvent(event: PointerEvent) {
    return {
        type: "pointerup",
        button: event.button,
        mousePos: getMousePos(event),
    };
}

function wheelEvent(event: WheelEvent) {
    return {
        type: "wheel",
        mousePos: getMousePos(event),
        deltaY: event.deltaY,
    };
}

function blockContextMenus(event: MouseEvent) {
    event.preventDefault();
}

const eventPipelines = {
    pointerdown: Pipeline.of(pointerDownEvent),
    pointermove: Pipeline.of(pointerMoveEvent),
    pointerup: Pipeline.of(pointerUpEvent),
    wheel: Pipeline.of(wheelEvent),
    contextmenu: Pipeline.of(blockContextMenus),
};






