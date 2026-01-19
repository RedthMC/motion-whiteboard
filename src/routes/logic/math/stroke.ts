import { getStrokePoints } from "perfect-freehand";
import * as freehand from "perfect-freehand";
import type { Vec2 } from "./vector";

type Point = number[];

type TimedPoint = Vec2 & { time: number; };

export class ScribbleBuilder {
    private points: TimedPoint[] = [];
    private lastingDuration: number;

    constructor(lastingDuration: number = 100) {
        this.lastingDuration = lastingDuration;
    }

    addPoint(point: Vec2) {
        this.points.push({ ...point, time: Date.now() });
    }

    // null if no points
    buildPath(thickness: number): string | null {
        this.points = this.points.filter(p => Date.now() - p.time < this.lastingDuration);
        if (this.points.length === 0) return null;
        const withPressure = this.points.map(p => [p.x, p.y]);
        const strokePoints = getStrokePoints(withPressure);
        const stroke = freehand.getStrokeOutlinePoints(strokePoints, { start: { taper: true }, size: thickness });
        return getSvgPathFromPoints(stroke, true);
    }
}

function precise(A: Point) {
    return `${toDomPrecision(A[0])},${toDomPrecision(A[1])} `;
}

function toDomPrecision(v: number) {
    return Math.round(v * 1e4) / 1e4;
}

function average(A: Point, B: Point) {
    return `${toDomPrecision((A[0] + B[0]) / 2)},${toDomPrecision((A[1] + B[1]) / 2)} `;
}

export function getSvgPathFromPoints(points: Point[], closed = false): string {
    const len = points.length;

    if (len < 2) return '';

    let a = points[0];
    let b = points[1];

    if (len === 2) return `M${precise(a)}L${precise(b)}`;

    let result = '';

    for (let i = 2, max = len - 1; i < max; i++) {
        a = points[i];
        b = points[i + 1];
        result += average(a, b);
    }

    if (closed) {
        // If closed, draw a curve from the last point to the first
        return `M${average(points[0], points[1])}Q${precise(points[1])}${average(
            points[1],
            points[2]
        )}T${result}${average(points[len - 1], points[0])}${average(
            points[0],
            points[1]
        )}Z`;
    } else {
        // If not closed, draw a curve starting at the first point and
        // ending at the midpoint of the last and second-last point, then
        // complete the curve with a line segment to the last point.
        return `M${precise(points[0])}Q${precise(points[1])}${average(
            points[1],
            points[2]
        )}${points.length > 3 ? 'T' : ''}${result}L${precise(points[len - 1])}`;
    }
}

export function getSvgPathFromVec2Points(vec2s: Vec2[], closed = false): string {
    const points = getStrokePoints(vec2s);
    const len = points.length;

    if (len < 2) return '';

    let a = points[0].point;
    let b = points[1].point;

    if (len === 2) return `M${precise(a)}L${precise(b)}`;

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
