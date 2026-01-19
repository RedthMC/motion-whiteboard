import { Camera } from "./manager/camera.svelte";
import { Toolbox } from "./manager/toolbox.svelte";
import { Pan, Brush, Eraser, Select } from "./tool/tools.svelte";
import { StyleManager } from "./manager/style_manager.svelte";
import type { ElementProvider } from "./interface/interface";
import { ElementManager } from "./element/elements.svelte";
import { TextElement } from "./element/text/text_element.svelte";

export class AppState {
    readonly elements: ElementProvider = new ElementManager();
    readonly camera = new Camera();
    readonly styleManager = new StyleManager();

    // Tools wiring
    private readonly pan = new Pan(this.camera);
    private readonly brush = new Brush(this.elements, this.styleManager);
    readonly eraser = new Eraser(this.elements);
    readonly select = new Select(this.elements);

    readonly toolbox = new Toolbox<"select" | "hand" | "draw" | "eraser">(
        {
            select: [this.select, this.pan],
            hand: [this.pan, this.pan, this.pan],
            draw: [this.brush, this.pan, this.eraser],
            eraser: [this.eraser, this.pan],
        },
        "select",
        this.camera
    );

    createText() {
        this.elements.addElement(new TextElement(
            this.camera.toCanvasCoords({ x: 1920 / 2, y: 1080 / 2 }),
            "Te\nxt",
            this.styleManager.color,
            24,
            300
        ));
    }
}
