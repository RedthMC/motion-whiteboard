type Vec2 = { x: number; y: number; };

function add(a: Vec2, b: Vec2) {
    return { x: a.x + b.x, y: a.y + b.y };
};

function subtract(a: Vec2, b: Vec2): Vec2 {
    return { x: a.x - b.x, y: a.y - b.y };
}

function multiply(a: Vec2, n: number): Vec2 {
    return { x: a.x * n, y: a.y * n };
}

function divide(a: Vec2, n: number): Vec2 {
    return { x: a.x / n, y: a.y / n };
}

function len(a: Vec2): number {
    return Math.sqrt(a.x * a.x + a.y * a.y);
}

function lengthSquared(a: Vec2): number {
    return Math.sqrt(a.x * a.x + a.y * a.y);
}

function normalize(a: Vec2): Vec2 {
    const l = len(a);
    return l === 0 ? { x: 0, y: 0 } : divide(a, l);
}

function distance(a: Vec2, b: Vec2): number {
    return len(subtract(a, b));
}

function distanceSquared(a: Vec2, b: Vec2): number {
    return lengthSquared(subtract(a, b));
}

function lerp(a: Vec2, b: Vec2, t: number): Vec2 {
    return add(multiply(a, 1 - t), multiply(b, t));
}

type Vec3 = { x: number; y: number; z: number; };

function inRect(rect: Rect, point: Vec2) {
    return (
        rect.left < point.x &&
        point.x < rect.right &&
        rect.top < point.y &&
        point.y < rect.bottom
    );
}

type Rect = { left: number, top: number, right: number, bottom: number; };

function rect(a: Vec2, b: Vec2): Rect {
    return {
        left: Math.min(a.x, b.x),
        top: Math.min(a.y, b.y),
        right: Math.max(a.x, b.x),
        bottom: Math.max(a.y, b.y),
    };
}


function expandRect(rect: Rect, point: Vec2, margin: number = 5): Rect {
    return {
        left: Math.min(rect.left, point.x - margin),
        top: Math.min(rect.top, point.y - margin),
        right: Math.max(rect.right, point.x + margin),
        bottom: Math.max(rect.bottom, point.y + margin),
    };
}

function intersectRect(r1: Rect, r2: Rect) {
    return !(
        r2.left > r1.right ||
        r2.right < r1.left ||
        r2.top > r1.bottom ||
        r2.bottom < r1.top
    );
}


export {
    type Vec2, type Vec3, type Rect,
    add, subtract, multiply, divide, len, lengthSquared, normalize, distance, distanceSquared, lerp,
    inRect, expandRect, rect, intersectRect
};
