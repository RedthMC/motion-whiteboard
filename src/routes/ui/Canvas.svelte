<script lang="ts">
    import type { AppState } from "../logic/app.svelte";
    import TextEditing from "../logic/element/text/TextEditing.svelte";

    const { app }: { app: AppState } = $props();
</script>

<div class="element-layer" style:transform={app.camera.tranformationStyle}>
    {#each app.elements as element (element.id)}
        {#if element !== app.select.editingText}
            <element.component object={element} />
        {/if}
    {/each}

    {#if app.toolbox.selectedTool === "select"}
        {#each app.select.selectedElements as element (element.id)}
            <element.componentHighlight object={element} />
        {/each}
        {#if app.select.selectedFrame}
            {@const frame = app.select.selectedFrame}
            <div
                class="selection-marquee"
                style:left="{frame.left}px"
                style:top="{frame.top}px"
                style:width="{frame.right - frame.left}px"
                style:height="{frame.bottom - frame.top}px"
            ></div>
        {/if}
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

    {#if app.select.editingText}
        <TextEditing object={app.select.editingText} />
    {/if}

    {#if app.eraser.trailPath}
        <svg class="elements eraser-trail">
            <path d={app.eraser.trailPath} stroke-linecap="round" />
        </svg>
    {/if}
</div>

<style>
    .element-layer {
        position: relative;
        top: 0;
        left: 0;
        width: 0;
        height: 0;
        pointer-events: none;
        transition: transform 75ms ease-out;
        contain: layout style size;
    }

    .selection-marquee {
        position: absolute;
        border: 1px dashed var(--color-primary);
        background-color: var(--color-primary);
        opacity: 0.1;
    }

    .elements {
        position: absolute;
        top: 0px;
        left: 0px;
        overflow: visible;
        transform-origin: top left;
    }

    .eraser-trail {
        fill: #94a3b8;
        fill-opacity: 0.2;
    }
</style>
