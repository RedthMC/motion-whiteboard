
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { ToolManager, type ElementContext } from './tools.svelte';
import type { InputHandler, PointerDownEvent, PointerMoveEvent, PointerUpEvent, PointerWheelEvent } from './datastorage.svelte';
import type { Camera } from './camera.svelte';

// Mock dependencies
const createMockCamera = () => ({
    zoomAt: vi.fn(),
    moveBy: vi.fn(),
} as unknown as Camera);

const createMockInputHandler = () => {
    const subscribers = new Map<string, Function>();
    return {
        subscribe: vi.fn((event, callback) => {
            subscribers.set(event, callback);
            return vi.fn(); // unsubscribe mock
        }),
        // Helper to trigger events
        trigger: (event: string, payload: any) => {
            const callback = subscribers.get(event);
            if (callback) callback(payload);
        }
    } as unknown as InputHandler & { trigger: (e: string, p: any) => void; };
};

const createMockElementContext = () => ({
    addElement: vi.fn((e) => e), // Just return the element
    filterUpElements: vi.fn(),
    findElement: vi.fn(),
    findElements: vi.fn(),
} as unknown as ElementContext);

describe('ToolManager', () => {
    let toolManager: ToolManager;
    let camera: Camera;
    let inputHandler: InputHandler & { trigger: (e: string, p: any) => void; };
    let elementContext: ElementContext;

    beforeEach(() => {
        camera = createMockCamera();
        inputHandler = createMockInputHandler();
        elementContext = createMockElementContext();
        toolManager = new ToolManager(camera, inputHandler, elementContext);
    });

    it('should initialize with brush tool by default', () => {
        // We can't easily check private properties, but we can verify behavior
        // Trigger generic pointer down
        const event: PointerDownEvent = {
            type: 'pointerdown',
            button: 0, // Left click
            mousePos: { onCanvas: { x: 0, y: 0 }, raw: { x: 0, y: 0 } }
        };
        inputHandler.trigger('pointerdown', event);

        // Brush adds an element on down
        expect(elementContext.addElement).toHaveBeenCalled();
    });

    describe('Brush Tool', () => {
        it('should create a stroke on mouse down', () => {
            const event: PointerDownEvent = {
                type: 'pointerdown',
                button: 0,
                mousePos: { onCanvas: { x: 10, y: 10 }, raw: { x: 10, y: 10 } }
            };
            inputHandler.trigger('pointerdown', event);

            expect(elementContext.addElement).toHaveBeenCalledWith(expect.objectContaining({
                type: 'stroke',
                position: { x: 10, y: 10 }
            }));
        });

        it('should update stroke path on mouse move', () => {
            // Mouse down first
            inputHandler.trigger('pointerdown', {
                type: 'pointerdown',
                button: 0,
                mousePos: { onCanvas: { x: 0, y: 0 }, raw: { x: 0, y: 0 } }
            });

            // Iterate through the mock calls to find the stroke object reference passed to addElement
            const addElementMock = elementContext.addElement as Mock;
            const stroke = addElementMock.mock.results[0].value;
            const originalPath = stroke.path;

            // Mouse move
            inputHandler.trigger('pointermove', {
                type: 'pointermove',
                button: 0,
                mousePos: { onCanvas: { x: 10, y: 10 }, raw: { x: 10, y: 10 } }
            });

            // Path should have changed
            expect(stroke.path).not.toBe(originalPath);
        });
    });

    describe('Eraser Tool', () => {
        beforeEach(() => {
            toolManager.switchTool('eraser');
        });

        it('should filter elements on mouse move', () => {
            // Eraser needs mouse down to be active first? 
            // Looking at code: Eraser.onDown sets used, onMove checks if lastPosition exists
            inputHandler.trigger('pointerdown', {
                type: 'pointerdown',
                button: 0,
                mousePos: { onCanvas: { x: 0, y: 0 }, raw: { x: 0, y: 0 } }
            });

            inputHandler.trigger('pointermove', {
                type: 'pointermove',
                button: 0,
                mousePos: { onCanvas: { x: 10, y: 10 }, raw: { x: 10, y: 10 } }
            });

            expect(elementContext.filterUpElements).toHaveBeenCalled();
        });
    });

    describe('Pan Tool (Middle Mouse)', () => {
        it('should move camera on mouse move with middle button', () => {
            // Middle mouse down
            inputHandler.trigger('pointerdown', {
                type: 'pointerdown',
                button: 1, // Middle click
                mousePos: { onCanvas: { x: 0, y: 0 }, raw: { x: 100, y: 100 } }
            });

            // Move
            inputHandler.trigger('pointermove', {
                type: 'pointermove',
                button: 1, // Middle 
                mousePos: { onCanvas: { x: 10, y: 10 }, raw: { x: 90, y: 90 } } // Moved 10px left/up in raw coords
            });

            // Delta is (100,100) - (90,90) = (10, 10)
            expect(camera.moveBy).toHaveBeenCalledWith({ x: 10, y: 10 });
        });
    });

    describe('Zoom', () => {
        it('should zoom in on scroll up', () => {
            inputHandler.trigger('wheel', {
                type: 'wheel',
                deltaY: -100, // Scroll up
                mousePos: { onCanvas: { x: 0, y: 0 }, raw: { x: 50, y: 50 } }
            });

            expect(camera.zoomAt).toHaveBeenCalledWith(expect.objectContaining({
                x: 50,
                y: 50,
                z: 1.25 // Expected zoom factor for scroll up
            }));
        });

        it('should zoom out on scroll down', () => {
            inputHandler.trigger('wheel', {
                type: 'wheel',
                deltaY: 100, // Scroll down
                mousePos: { onCanvas: { x: 0, y: 0 }, raw: { x: 50, y: 50 } }
            });

            expect(camera.zoomAt).toHaveBeenCalledWith(expect.objectContaining({
                x: 50,
                y: 50,
                z: 0.8 // Expected zoom factor for scroll down
            }));
        });
    });
});
