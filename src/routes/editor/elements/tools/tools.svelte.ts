import { getStrokePoints, type StrokePoint } from "perfect-freehand";
import { expandRect, inRect, intersectRect, rect, subtract, type Rect, type Vec2 } from "./vector";
import type { Element, Stroke } from "../elements";
import type { InputHandler, PointerDownEvent, PointerMoveEvent, PointerUpEvent, PointerWheelEvent } from "./datastorage.svelte";
import type { Camera } from "./camera.svelte";

export class ToolManager {
    private readonly camera: Camera;
    private readonly inputHandler: InputHandler;
    private readonly elementContext: ElementContext;
    private readonly panningTool: Pan;
    private tool: Tool;

    constructor(camera: Camera, inputHandler: InputHandler, elementContext: ElementContext) {
        this.camera = camera;
        this.inputHandler = inputHandler;
        this.elementContext = elementContext;
        this.panningTool = new Pan(this.camera);
        this.tool = new Brush(this.elementContext);

        this.inputHandler.subscribe("pointerdown", this.onMouseDown.bind(this));
        this.inputHandler.subscribe("pointermove", this.onMouseMove.bind(this));
        this.inputHandler.subscribe("pointerup", this.onMouseUp.bind(this));
        this.inputHandler.subscribe("wheel", this.processZoom.bind(this));
    }

    switchTool(toolName: string) {
        this.tool = this.createTool(toolName);
    }

    private createTool(toolName: string): Tool {
        switch (toolName) {
            case "brush":
                return new Brush(this.elementContext);
            case "eraser":
                return new Eraser(this.elementContext);
            default:
                return new Brush(this.elementContext);
        }
    }

    processZoom(event: PointerWheelEvent) {
        const { x, y } = event.mousePos.raw;

        if (event.deltaY > 0) {
            this.camera.zoomAt({ x, y, z: 0.8 });
        } else if (event.deltaY < 0) {
            this.camera.zoomAt({ x, y, z: 1.25 });
        }
    }

    onMouseDown(event: PointerDownEvent) {
        if (event.button == LEFT_MOUSE_BUTTON) {
            this.tool.onDown(event.mousePos);
        } else if (event.button == MID_MOUSE_BUTTON) {
            this.panningTool.onDown(event.mousePos);
        }
    }

    onMouseMove(event: PointerMoveEvent) {
        // they both can handle mouse pure moving
        this.tool.onMove(event.mousePos);
        this.panningTool.onMove(event.mousePos);
    }

    onMouseUp(event: PointerUpEvent) {
        this.tool.onUp(event.mousePos);
        this.panningTool.onUp(event.mousePos);
    }
}

export type MousePos = {
    onCanvas: Vec2;
    raw: Vec2;
};

export interface ElementContext {
    addElement<T extends Element>(element: T): T;
    filterUpElements(predicate: (element: Element) => unknown): void;
    findElement(predicate: (element: Element) => unknown): Element | undefined;
    findElements(predicate: (element: Element) => unknown): Element[];
}

interface Tool {
    onMove(position: MousePos): void;
    onDown(position: MousePos): void;
    onUp(position: MousePos): void;
}

class Select implements Tool {
    private readonly app: ElementContext;
    constructor(app: ElementContext) {
        this.app = app;
    }

    private initPosRaw: Vec2 | null = null;
    private hovering: Element | undefined;
    private status: "framing" | "moving" | undefined;
    private selection: Element[] = [];


    onDown(position: MousePos): void {
        if (this.hovering) {
            this.status = "moving";
            if (!this.selection.includes(this.hovering)) {
                this.selection = [this.hovering];
            }
        } else {
            this.status = "framing";
            this.selection = [];
        }
        this.initPosRaw = position.raw;
    }

    isHovering(element: Element, position: Vec2) {
        return (element.type == "stroke") && inRect(element.boundingBox, position);
    }

    isFramed(element: Element, frame: Rect) {
        return (element.type == "stroke") && intersectRect(element.boundingBox, frame);
    }

    onMove(position: MousePos): void {
        if (!this.status) {
            this.hovering = this.app.findElement(e => this.isHovering(e, position.onCanvas));
            return;
        }
        this.hovering = undefined;
        if (!this.initPosRaw) return;

        if (this.status == "framing") {
            const frame = rect(this.initPosRaw, position.onCanvas);
            this.selection = this.app.findElements(e => this.isFramed(e, frame));
        } else {
            // moving
            // need selection border, calc offset <- onclick, add offset
        }
    }

    onUp(position: MousePos): void {
        this.initPosRaw = null;
    }
}

class Brush implements Tool {
    private readonly elementContext: ElementContext;
    constructor(elementContext: ElementContext) {
        this.elementContext = elementContext;
    }

    private drawingStroke: { initialPosition: Vec2, points: Vec2[], stroke: Stroke; } | null = null;

    onDown(position: MousePos) {
        this.drawingStroke = {
            initialPosition: position.onCanvas,
            points: [{ x: 0, y: 0 }],
            stroke: this.elementContext.addElement({
                type: "stroke",
                id: "a",
                position: position.onCanvas,
                path: "M0,0Z",
                boundingBox: { left: -5, top: -5, right: 5, bottom: 5 },
            }),
        };
    }

    onMove(position: MousePos) {
        if (!this.drawingStroke) return; // "drawingStroke is null" means "mouse is not down"

        const pointOffset = subtract(position.onCanvas, this.drawingStroke.initialPosition);
        this.drawingStroke.points.push(pointOffset);
        this.drawingStroke.stroke.boundingBox = expandRect(this.drawingStroke.stroke.boundingBox, pointOffset);
        this.drawingStroke.stroke.path = getSvgPathFromStrokePoints(
            getStrokePoints(this.drawingStroke.points, {
                streamline: 0.1,
            }),
        );
    }

    onUp(position: MousePos) {
        this.drawingStroke = null;
    }
}

class Pan implements Tool {
    private readonly camera: Camera;
    constructor(camera: Camera) {
        this.camera = camera;
    }

    private initPosRaw: Vec2 | null = null;

    onDown(position: MousePos): void {
        this.initPosRaw = position.raw;
    }

    onMove(position: MousePos): void {
        if (!this.initPosRaw) return;

        const pos = subtract(this.initPosRaw, position.raw);
        this.camera.moveBy(pos);
        this.initPosRaw = position.raw;
    }

    onUp(position: MousePos): void {
        this.initPosRaw = null;
    }
}

class Eraser implements Tool {
    private readonly elementContext: ElementContext;
    constructor(elementContext: ElementContext) {
        this.elementContext = elementContext;
    }

    private lastPosition: Vec2 | null = null;

    onDown(position: MousePos): void {
        this.lastPosition = position.raw;
    }

    onMove(position: MousePos): void {
        if (!this.lastPosition) return;

        const shouldBeKept = (e: Element) =>
            e.type !== "stroke" ||
            !inRect(e.boundingBox, subtract(position.onCanvas, e.position));
        this.elementContext.filterUpElements(shouldBeKept);
        this.lastPosition = position.onCanvas;
    }

    onUp(position: MousePos): void {
        this.lastPosition = null;
    }
}

const LEFT_MOUSE_BUTTON = 0;
const MID_MOUSE_BUTTON = 1;
const RIGHT_MOUSE_BUTTON = 2;


// // tooling
// type Tooling = {
//     [E: string]: { left: ActionFunction, mid: ActionFunction, right: ActionFunction; };
// };

// const tooling: Tooling = {
//     brush: { left: draw, mid: pan, right: erase },
//     eraser: { left: erase, mid: pan, right: $todo$ },
//     text: { left: $todo$, mid: pan, right: $todo$ },
// };

// type MousePos = {
//     mousePosOnCanvas: Vec2,
//     mouseRawPos: Vec2,
// };

// type ActionFunction = (mousePos: MousePos) => ({
//     drag(mousePos: MousePos): void;
//     release(mousePos: MousePos): void;
// });

// function draw({ mousePosOnCanvas: initialPosition }: MousePos) {
//     // press
//     let points: Vec2[] = [];
//     let boundingBox = { start: { x: -5, y: -5 }, end: { x: 5, y: 5 } };

//     let path = getSvgPathFromStrokePoints(
//         getStrokePoints(points, {
//             streamline: 0.1,
//         }),
//     );

//     // drag
//     function drag({ mousePosOnCanvas }: MousePos) {
//         const pointOffset = subtract(
//             mousePosOnCanvas,
//             initialPosition,
//         );
//         points.push(pointOffset);

//         boundingBox.start.x = Math.min(boundingBox.start.x, pointOffset.x - 5);
//         boundingBox.start.y = Math.min(boundingBox.start.y, pointOffset.y - 5);
//         boundingBox.end.x = Math.max(boundingBox.end.x, pointOffset.x + 5);
//         boundingBox.end.y = Math.max(boundingBox.end.y, pointOffset.y + 5);

//         path = getSvgPathFromStrokePoints(
//             getStrokePoints(points, {
//                 streamline: 0.1,
//             }),
//         );
//     }

//     // release
//     function release() {
//         const strokeObj: Stroke = {
//             type: "stroke",
//             id: "a",
//             position: initialPosition,
//             path,
//             boundingBox,
//         };

//         elements.push(strokeObj);
//     }

//     return { drag, release };
// }


// function pan({ mouseRawPos: initPosRaw }: MousePos) {
//     //drag
//     function drag({ mouseRawPos }: MousePos) {
//         const pos = subtract(initPosRaw, mouseRawPos);
//         camera.x += pos.x;
//         camera.y += pos.y;
//         initPosRaw = mouseRawPos;
//     }
//     return { drag, release() { } };
// }



// function erase({ mousePosOnCanvas: lastPosition }: MousePos) {
//     //drag
//     function drag({ mousePosOnCanvas }: MousePos) {
//         const shouldBeKept = (e: Element) => e.type !== "stroke" || !inBB(e.boundingBox, subtract(mousePosOnCanvas, e.position));
//         elements = elements.filter(shouldBeKept);
//         lastPosition = mousePosOnCanvas;
//     }
//     return { drag, release() { } };
// }


// function $todo$() {
//     return { drag() { }, release() { } };
// }













type Point = { x: number, y: number; };

type VecLike = number[];

export function precise(A: VecLike) {
    return `${toDomPrecision(A[0])},${toDomPrecision(A[1])} `;
}

export function toDomPrecision(v: number) {
    return Math.round(v * 1e4) / 1e4;
}

export function average(A: VecLike, B: VecLike) {
    return `${toDomPrecision((A[0] + B[0]) / 2)},${toDomPrecision((A[1] + B[1]) / 2)} `;
}

export function getSvgPathFromStrokePoints(points: StrokePoint[], closed = false): string {
    const len = points.length;

    if (len < 2) {
        return '';
    }

    let a = points[0].point;
    let b = points[1].point;

    if (len === 2) {
        return `M${precise(a)}L${precise(b)}`;
    }

    let result = '';

    for (let i = 2, max = len - 1; i < max; i++) {
        a = points[i].point;
        b = points[i + 1].point;
        result += average(a, b);
    }

    if (closed) {
        // If closed, draw a curve from the last point to the first
        return `M${average(points[0].point, points[1].point)}Q${precise(points[1].point)}${average(
            points[1].point,
            points[2].point
        )}T${result}${average(points[len - 1].point, points[0].point)}${average(
            points[0].point,
            points[1].point
        )}Z`;
    } else {
        // If not closed, draw a curve starting at the first point and
        // ending at the midpoint of the last and second-last point, then
        // complete the curve with a line segment to the last point.
        return `M${precise(points[0].point)}Q${precise(points[1].point)}${average(
            points[1].point,
            points[2].point
        )}${points.length > 3 ? 'T' : ''}${result}L${precise(points[len - 1].point)}`;
    }
}

