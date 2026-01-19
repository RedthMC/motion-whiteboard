import { ScribbleBuilder } from "../math/stroke";
import type { Vec2 } from "../math/vector";

export class TrailManager {
    private scribbleBuilder = new ScribbleBuilder();
    private timer: ReturnType<typeof setInterval> | null = null;

    trailPath = $state("");
    thickness: number;

    constructor(thickness: number = 25) {
        this.thickness = thickness;
    }

    addPoint(point: Vec2) {
        this.scribbleBuilder.addPoint(point);
        this.ensureTimer();
    }

    private ensureTimer() {
        if (this.timer) return;
        this.timer = setInterval(() => {
            const path = this.scribbleBuilder.buildPath(this.thickness);
            if (!path) { // If path is null, we can stop the timer to save resources
                this.stopTimer();
                return;
            }
            this.trailPath = path;
        }, 16);
    }

    private stopTimer() {
        if (!this.timer) return;
        clearInterval(this.timer);
        this.timer = null;
    }
}
