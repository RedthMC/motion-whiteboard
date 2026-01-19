<script lang="ts">
    import Toolbar from "./Toolbar.svelte";
    import StylePanel from "./StylePanel.svelte";
    import "../../app.css";
    import { getAppState } from "../logic/context";
    const app = getAppState();
</script>

<div class="overlay-layer" class:tool-active={!app.toolbox.isIdle()}>
    <div class="child"><StylePanel /></div>
    <div class="child"><Toolbar /></div>
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
