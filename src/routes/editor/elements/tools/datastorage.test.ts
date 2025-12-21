
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InputHandler, type AppStateManager } from './datastorage.svelte';

describe('InputHandler', () => {
    let app: AppStateManager;
    let inputHandler: InputHandler;

    beforeEach(() => {
        // Create a mock AppStateManager that satisfies the interface
        app = {
            camera: {
                mapScreenPositionToCanvas: vi.fn((pos) => pos)
            },
            toolManager: {
                onMouseDown: vi.fn(),
                onMouseMove: vi.fn(),
                onMouseUp: vi.fn(),
                processZoom: vi.fn(),
            },
            inputHandler: undefined as any
        } as unknown as AppStateManager;

        inputHandler = new InputHandler(app);
        app.inputHandler = inputHandler;
    });

    it('should subscribe and notify pointerdown events', () => {
        const callback = vi.fn();
        inputHandler.subscribe('pointerdown', callback);

        const event = new PointerEvent('pointerdown', { button: 0, clientX: 10, clientY: 10 });
        inputHandler.onPointerDown(event);

        expect(callback).toHaveBeenCalledWith(expect.objectContaining({
            type: 'pointerdown',
            button: 0,
            mousePos: expect.objectContaining({
                raw: { x: 10, y: 10 }
            })
        }));
    });

    it('should subscribe and notify pointermove events', () => {
        const callback = vi.fn();
        inputHandler.subscribe('pointermove', callback);

        const event = new PointerEvent('pointermove', { button: 0, clientX: 20, clientY: 20 });
        inputHandler.onPointerMove(event);

        expect(callback).toHaveBeenCalledWith(expect.objectContaining({
            type: 'pointermove',
            button: 0,
            mousePos: expect.objectContaining({
                raw: { x: 20, y: 20 }
            })
        }));
    });

    it('should subscribe and notify pointerup events', () => {
        const callback = vi.fn();
        inputHandler.subscribe('pointerup', callback);

        const event = new PointerEvent('pointerup', { button: 0, clientX: 30, clientY: 30 });
        inputHandler.onPointerUp(event);

        expect(callback).toHaveBeenCalledWith(expect.objectContaining({
            type: 'pointerup',
            button: 0,
            mousePos: expect.objectContaining({
                raw: { x: 30, y: 30 }
            })
        }));
    });

    it('should subscribe and notify wheel events', () => {
        const callback = vi.fn();
        inputHandler.subscribe('wheel', callback);

        const event = new WheelEvent('wheel', { deltaY: 100, clientX: 40, clientY: 40 });
        // Mock preventDefault
        event.preventDefault = vi.fn();

        // Polyfill pageX/Y for happy-dom
        Object.defineProperty(event, 'clientX', { value: 40 });
        Object.defineProperty(event, 'clientY', { value: 40 });

        inputHandler.onWheel(event);

        expect(callback).toHaveBeenCalledWith(expect.objectContaining({
            type: 'wheel',
            deltaY: 100,
            mousePos: expect.objectContaining({
                raw: { x: 40, y: 40 }
            })
        }));
    });

    it('should unsubscribe correctly', () => {
        const callback = vi.fn();
        const unsubscribe = inputHandler.subscribe('pointerdown', callback);

        unsubscribe();

        const event = new PointerEvent('pointerdown', { button: 0 });
        inputHandler.onPointerDown(event);

        expect(callback).not.toHaveBeenCalled();
    });

    it('should handle multiple subscribers', () => {
        const callback1 = vi.fn();
        const callback2 = vi.fn();
        inputHandler.subscribe('pointerdown', callback1);
        inputHandler.subscribe('pointerdown', callback2);

        const event = new PointerEvent('pointerdown', { button: 0 });
        inputHandler.onPointerDown(event);

        expect(callback1).toHaveBeenCalled();
        expect(callback2).toHaveBeenCalled();
    });
});
