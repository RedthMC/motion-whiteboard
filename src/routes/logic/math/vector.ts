export type Vec2 = { readonly x: number; readonly y: number; };
export const Vec2 = {
    new: (x: number, y: number) => ({ x, y }),
    zero: () => ({ x: 0, y: 0 }),
    add: (a: Vec2, b: Vec2): Vec2 => ({ x: a.x + b.x, y: a.y + b.y }),
    subtract: (a: Vec2, b: Vec2): Vec2 => ({ x: a.x - b.x, y: a.y - b.y }),
    multiply: (a: Vec2, n: number): Vec2 => ({ x: a.x * n, y: a.y * n }),
    divide: (a: Vec2, n: number): Vec2 => ({ x: a.x / n, y: a.y / n }),
    length: (a: Vec2): number => Math.sqrt(a.x * a.x + a.y * a.y),
    lengthSquared: (a: Vec2): number => Math.sqrt(a.x * a.x + a.y * a.y),
    normalize: (a: Vec2): Vec2 => {
        const l = Vec2.length(a);
        return l === 0 ? { x: 0, y: 0 } : Vec2.divide(a, l);
    },
    distance: (a: Vec2, b: Vec2): number => Vec2.length(Vec2.subtract(a, b)),
    distanceSquared: (a: Vec2, b: Vec2): number => Vec2.lengthSquared(Vec2.subtract(a, b)),
    lerp: (a: Vec2, b: Vec2, t: number): Vec2 => Vec2.add(Vec2.multiply(a, 1 - t), Vec2.multiply(b, t)),
};

export type Vec3 = { readonly x: number; readonly y: number; readonly z: number; };
export const Vec3 = {
    zero: { x: 0, y: 0, z: 0 },
    add: (a: Vec3, b: Vec3): Vec3 => ({ x: a.x + b.x, y: a.y + b.y, z: a.z + b.z }),
    subtract: (a: Vec3, b: Vec3): Vec3 => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z }),
    multiply: (a: Vec3, n: number): Vec3 => ({ x: a.x * n, y: a.y * n, z: a.z * n }),
    divide: (a: Vec3, n: number): Vec3 => ({ x: a.x / n, y: a.y / n, z: a.z / n }),
    length: (a: Vec3): number => Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z),
    lengthSquared: (a: Vec3): number => Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z),
    normalize: (a: Vec3): Vec3 => {
        const l = Vec3.length(a);
        return l === 0 ? { x: 0, y: 0, z: 0 } : Vec3.divide(a, l);
    },
    distance: (a: Vec3, b: Vec3): number => Vec3.length(Vec3.subtract(a, b)),
    distanceSquared: (a: Vec3, b: Vec3): number => Vec3.lengthSquared(Vec3.subtract(a, b)),
    lerp: (a: Vec3, b: Vec3, t: number): Vec3 => Vec3.add(Vec3.multiply(a, 1 - t), Vec3.multiply(b, t)),
};

export type Rect = { left: number, top: number, right: number, bottom: number; };
export const Rect = {
    new: (left: number, top: number, right: number, bottom: number) => ({ left, top, right, bottom }),
    add: (rect: Rect, point: Vec2): Rect => ({
        left: rect.left + point.x,
        top: rect.top + point.y,
        right: rect.right + point.x,
        bottom: rect.bottom + point.y,
    }),
    inRect: (rect: Rect, point: Vec2) => (
        rect.left < point.x &&
        point.x < rect.right &&
        rect.top < point.y &&
        point.y < rect.bottom
    ),
    expand: (rect: Rect, point: Vec2, margin: number = 5): Rect => ({
        left: Math.min(rect.left, point.x - margin),
        top: Math.min(rect.top, point.y - margin),
        right: Math.max(rect.right, point.x + margin),
        bottom: Math.max(rect.bottom, point.y + margin),
    }),
    intersect: (r1: Rect, r2: Rect) => !(
        r2.left > r1.right ||
        r2.top > r1.bottom ||
        r2.right < r1.left ||
        r2.bottom < r1.top
    ),
    contain: (r1: Rect, r2: Rect): boolean => (
        r1.left <= r2.left &&
        r1.top <= r2.top &&
        r1.right >= r2.right &&
        r1.bottom >= r2.bottom
    ),
    merge: (r1: Rect, r2: Rect): Rect => ({
        left: Math.min(r1.left, r2.left),
        top: Math.min(r1.top, r2.top),
        right: Math.max(r1.right, r2.right),
        bottom: Math.max(r1.bottom, r2.bottom),
    }),
    fromPoints: (a: Vec2, b: Vec2): Rect => ({
        left: Math.min(a.x, b.x),
        top: Math.min(a.y, b.y),
        right: Math.max(a.x, b.x),
        bottom: Math.max(a.y, b.y),
    }),
};
