<script lang="ts">
    import { getAppState } from "../logic/context";
    const app = getAppState();

    import {
        Pencil,
        Eraser,
        Hand,
        Type,
        Image,
        Ellipsis,
        MousePointer2,
    } from "lucide-svelte";
    import "../../app.css";
</script>

<div class="toolbar-container">
    <div class="toolbar">
        <button
            class:active={app.toolbox.getModeName() === "select"}
            onclick={() => app.toolbox.switchMode("select")}
            aria-label="Select"
        >
            <MousePointer2 size={20} />
        </button>

        <button
            class:active={app.toolbox.getModeName() === "draw"}
            onclick={() => app.toolbox.switchMode("draw")}
            aria-label="Draw"
        >
            <Pencil size={20} />
        </button>

        <button
            class:active={app.toolbox.getModeName() === "hand"}
            onclick={() => app.toolbox.switchMode("hand")}
            aria-label="Hand"
        >
            <Hand size={20} />
        </button>

        <button
            class:active={app.toolbox.getModeName() === "eraser"}
            onclick={() => app.toolbox.switchMode("eraser")}
            aria-label="Eraser"
        >
            <Eraser size={20} />
        </button>

        <div class="separator"></div>

        <button aria-label="Text" onclick={() => app.createText()}>
            <Type size={20} />
        </button>

        <button aria-label="Image" disabled>
            <Image size={20} />
        </button>

        <div class="separator"></div>

        <button aria-label="More">
            <Ellipsis size={20} />
        </button>
    </div>
</div>

<style>
    .toolbar-container {
        position: fixed;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%);
        z-index: 100;
    }

    .toolbar {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: var(--color-bg);
        padding: 0.5rem;
        border-radius: var(--radius-panel);
        box-shadow: var(--shadow-floating);
        border: 1px solid var(--color-border);
    }

    button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2.5rem;
        height: 2.5rem;
        border: none;
        background: transparent;
        border-radius: var(--radius-panel);
        color: var(--color-icon);
        cursor: pointer;
        transition: all 0.2s;
    }

    button:hover:not(:disabled) {
        background-color: var(--color-hover-bg);
        color: var(--color-icon-hover);
    }

    button:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }

    button.active {
        background-color: var(--color-primary);
        color: var(--color-text-on-primary);
    }

    button.active:hover {
        background-color: var(--color-primary-hover);
    }

    .separator {
        width: 1px;
        height: 1.5rem;
        background-color: var(--color-border);
        margin: 0 0.25rem;
    }
</style>
