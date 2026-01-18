import type { Vec2, Vec3 } from "./vector";

export class Camera {
    private camera: Vec3 = $state({ x: 0, y: 0, z: 1 });
    readonly tranformationStyle = $derived(`translate(${-this.camera.x}px, ${-this.camera.y}px) scale(${this.camera.z},${this.camera.z})`);

    moveBy(by: Vec2) {
        this.camera.x += by.x;
        this.camera.y += by.y;
    }

    zoomAt(at: Vec2, by: number) {
        this.camera.x = -(at.x - by * (at.x + this.camera.x));
        this.camera.y = -(at.y - by * (at.y + this.camera.y));
        this.camera.z *= by;
    }

    toCanvasCoords(screenCoords: Vec2): Vec2 {
        return {
            x: (screenCoords.x + this.camera.x) / this.camera.z,
            y: (screenCoords.y + this.camera.y) / this.camera.z,
        };
    }
}