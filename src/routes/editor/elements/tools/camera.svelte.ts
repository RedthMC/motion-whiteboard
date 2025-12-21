import type { Vec2, Vec3 } from "./vector";

export class Camera {
    private camera: Vec3 = $state({ x: 0, y: 0, z: 1 });
    readonly tranformationStyle = $derived(`translate(${-this.camera.x}px, ${-this.camera.y}px) scale(${this.camera.z},${this.camera.z})`);

    moveBy(by: Vec2) {
        this.camera.x += by.x;
        this.camera.y += by.y;
    }

    zoomAt(scaleAtBy: Vec3) {
        this.camera.x = -(scaleAtBy.x - scaleAtBy.z * (scaleAtBy.x + this.camera.x));
        this.camera.y = -(scaleAtBy.y - scaleAtBy.z * (scaleAtBy.y + this.camera.y));
        this.camera.z *= scaleAtBy.z;
    }

    mapScreenPositionToCanvas(positionOnScreen: Vec2): Vec2 {
        return {
            x: (positionOnScreen.x + this.camera.x) / this.camera.z,
            y: (positionOnScreen.y + this.camera.y) / this.camera.z,
        };
    }


}