import { Camera } from "./manager/camera.svelte";
import { Toolbox } from "./manager/toolbox.svelte";
import { StyleManager } from "./manager/style_manager.svelte";
import type { ManagerProvider } from "./interface/interface";
import { ElementManager } from "./element/elements.svelte";
import { TextElement } from "./element/text/text_element.svelte";
import { SelectionManager } from "./manager/selection.svelte";
import { SelectMode, DrawMode, EraserMode, HandMode } from "./mode/modes.svelte";
import { TrailManager } from "./manager/trail_manager.svelte";

export class AppState implements ManagerProvider {
    readonly elements = new ElementManager();
    readonly camera = new Camera();
    readonly styleManager = new StyleManager();
    readonly selection = new SelectionManager();
    readonly trail = new TrailManager(25);

    readonly modes = {
        select: new SelectMode(this),
        draw: new DrawMode(this),
        eraser: new EraserMode(this),
        hand: new HandMode(this),
    };

    readonly toolbox = new Toolbox(this.modes.select, this.camera);

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
