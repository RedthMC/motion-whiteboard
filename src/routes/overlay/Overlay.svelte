<script lang="ts">
    import Toolbar from "./Toolbar.svelte";
    import StylePanel from "./StylePanel.svelte";
    import "./theme.css";
    import type { AppState } from "../logic/app.svelte";

    const { app }: { app: AppState } = $props();
</script>

<div
    class="overlay-layer"
    class:tool-active={app.toolbox.activeTool !== undefined}
>
    <div class="child"><StylePanel {app} /></div>
    <div class="child"><Toolbar {app} /></div>
</div>

<style>
    .overlay-layer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        transition: opacity 0.2s;
        z-index: 100;
    }

    /* When drawing, fade out and disable all interaction */
    .overlay-layer.tool-active {
        opacity: 0.3;
    }

    .child {
        pointer-events: auto;
    }

    .tool-active .child {
        pointer-events: none;
    }
</style>
