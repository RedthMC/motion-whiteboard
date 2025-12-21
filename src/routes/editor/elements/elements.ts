import type { Rect, Vec2 } from "./tools/vector";

export type Element = Stroke | Text;

export type Stroke = {
    id: string,
    type: "stroke",
    position: {x: number, y: number},
    path: string,
    boundingBox: Rect,
}

export type Text = {
    id: string,
    type: "text",
    text: "",
}
