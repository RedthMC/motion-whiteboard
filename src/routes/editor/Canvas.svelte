<script lang="ts">
    import type { AppState } from "../logic/app.svelte";
    import {
        renderElement,
        renderHighlight,
        renderEraserTrail,
    } from "./elements/Snippets.svelte";

    const { app }: { app: AppState } = $props();
</script>

<div class="element-layer" style:transform={app.camera.tranformationStyle}>
    {#if app.toolbox.selectedTool === "select"}
        {#each app.select.selectedElements as element (element.id)}
            {@render renderHighlight(element)}
        {/each}
    {/if}
    {#each app.elements as element (element.id)}
        {@render renderElement(element)}
    {/each}

    {#if app.eraser.trailPath}
        {@render renderEraserTrail(app.eraser.trailPath)}
    {/if}

    {#if app.select.selectionFrame}
        {@const frame = app.select.selectionFrame}
        <div
            class="selection-marquee"
            style:left="{frame.left}px"
            style:top="{frame.top}px"
            style:width="{frame.right - frame.left}px"
            style:height="{frame.bottom - frame.top}px"
        ></div>
    {/if}
</div>

<style>
    .element-layer {
        position: relative;
        top: 0;
        left: 0;
        width: 0;
        height: 0;
        transition: transform 75ms ease-out;
        contain: layout style size;
    }

    .selection-marquee {
        position: absolute;
        border: 1px dashed var(--color-primary);
        background-color: var(--color-primary);
        opacity: 0.1;
        pointer-events: none;
    }
</style>
