import { Rect, Vec2 } from "../../math/vector";
import type { Element } from "../../interface/interface";
import TextHighlight from "./TextHighlight.svelte";
import Text from "./Text.svelte";

export class TextElement implements Element {
    readonly type = "text";
    readonly component = Text;
    readonly componentHighlight = TextHighlight;

    readonly id: string;
    position: Vec2;
    text: string;
    color: string;
    size: number;
    width: number = $state(300);
    height: number = $state(24);
    boundingBox: Rect = $derived({ left: 0, top: 0, right: this.width, bottom: this.height });

    constructor(
        position: Vec2,
        text: string,
        color: string,
        size: number,
        width: number = 300
    ) {
        this.id = crypto.randomUUID();
        this.position = $state(position);
        this.text = $state(text);
        this.color = $state(color);
        this.size = $state(size);
        this.width = width;
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
