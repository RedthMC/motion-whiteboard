import type { AppState } from "./data.svelte";
import { Pan } from "./tool.svelte";

export class Cursor {
    private readonly app: AppState;
    constructor(app: AppState) { this.app = app; }

    private readonly Icons = {
        pencil: {
            path: `<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>`,
            hotspot: { x: 2, y: 22 }
        },
        eraser: {
            path: `<path d="M21 21H8a2 2 0 0 1-1.42-.587l-3.994-3.999a2 2 0 0 1 0-2.828l10-10a2 2 0 0 1 2.829 0l5.999 6a2 2 0 0 1 0 2.828L12.834 21"/><path d="m5.082 11.09 8.828 8.828"/>`,
            hotspot: { x: 7, y: 20 }
        },
        grab: {
            path: `<path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/><path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>`,
            hotspot: { x: 11, y: 11 }
        },
        grabbing: {
            path: `<path d="M18 11.5V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v1.4"/><path d="M14 10V8a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2"/><path d="M10 9.9V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v5"/><path d="M6 14a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/><path d="M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-4a8 8 0 0 1-8-8 2 2 0 1 1 4 0"/>`,
            hotspot: { x: 11, y: 11 }
        },
        default: {
            path: `<path d="M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z"/>`,
            hotspot: { x: 2, y: 2 }
        },
    };

    private getCursor(
        name: keyof typeof this.Icons,
        color: string = "black"
    ): string {
        const icon = this.Icons[name];
        // double rendering to create a white border (stroke) around the icon
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="-2 -2 28 28" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <g stroke="white" stroke-width="5">${icon.path}</g>
            <g stroke="${color}" stroke-width="2">${icon.path}</g>   
        </svg>`;
        const url = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
        return `url('${url}') ${icon.hotspot.x} ${icon.hotspot.y}, auto`;
    }

    readonly style = $derived.by(() => {
        if (this.app.activeTool instanceof Pan) return this.getCursor("grabbing");
        switch (this.app.currentTool) {
            case "pan":
                return this.getCursor("grab");
            case "brush":
                return this.getCursor("pencil");
            case "eraser":
                return this.getCursor("eraser");
            default:
                return "default";
        }
    });
}
