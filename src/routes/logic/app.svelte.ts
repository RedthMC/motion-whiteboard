import { Camera } from "./component/camera.svelte";
import { ElementManager } from "./component/elements.svelte";
import { Toolbox } from "./component/toolbox.svelte";
import { Pan, Brush, Eraser, Select } from "./tool/tools.svelte";
import { StyleManager } from "./component/style_manager.svelte";

export class AppState {
    readonly elements = new ElementManager();
    readonly camera = new Camera();
    readonly styleManager = new StyleManager();

    // Tools wiring
    private readonly pan = new Pan(this.camera);
    private readonly brush = new Brush(this.elements, this.styleManager);
    private readonly eraser = new Eraser(this.elements);
    private readonly select = new Select(this.elements);

    readonly toolbox = new Toolbox<"hand" | "draw" | "eraser" | "select">(
        {
            hand: [this.pan, this.pan, this.pan],
            draw: [this.brush, this.pan, this.eraser],
            eraser: [this.eraser, this.pan],
            select: [this.select, this.pan],
        },
        "draw",
        this.camera
    );
}
