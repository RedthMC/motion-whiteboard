
import { Rect, Vec2 } from "../../math/vector";
import type { Element } from "../../interface/interface";
import StrokeHighlight from "./StrokeHighlight.svelte";
import Stroke from "./Stroke.svelte";

export class StrokeElement implements Element {
    readonly type = "stroke";
    readonly component = Stroke;
    readonly componentHighlight = StrokeHighlight;

    readonly id: string;
    position: Vec2;
    boundingBox: Rect;
    points: Vec2[];
    path: string;
    color: string;
    size: number;
    get thickness() {
        return 2 ** this.size;
    }

    constructor(
        position: Vec2,
        points: Vec2[],
        path: string,
        color: string,
        size: number,
        boundingBox: Rect,
    ) {
        this.id = crypto.randomUUID();
        this.position = $state(position);
        this.points = $state(points);
        this.path = $state(path);
        this.color = $state(color);
        this.size = $state(size);
        this.boundingBox = $state(boundingBox);
    }

    hitTest(pos: Vec2): boolean {
        return Rect.inRect(Rect.add(this.boundingBox, this.position), pos);
    }

    frameTest(frame: Rect): boolean {
        return Rect.intersect(
            Rect.add(this.boundingBox, this.position),
            frame,
        );
    }

}