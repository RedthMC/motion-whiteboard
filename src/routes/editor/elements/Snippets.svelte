<script module lang="ts">
    import type * as types from "../../logic/component/elements.svelte";
    export { renderElement, renderHighlight, renderEraserTrail };
    import "../../overlay/theme.css";
</script>

{#snippet renderEraserTrail(path: string)}
    <svg class="elements eraser-trail">
        <path d={path} stroke-linecap="round" />
    </svg>
{/snippet}

{#snippet renderElement(object: types.Element)}
    {#if object.type === "stroke"}
        {@render stroke(object)}
    {:else if object.type === "text"}
        {@render text(object)}
    {/if}
{/snippet}

{#snippet renderHighlight(object: types.Element)}
    {#if object.type === "stroke"}
        {@render highlightStroke(object)}
    {:else if object.type === "text"}
        {@render highlightText(object)}
    {/if}
{/snippet}

{#snippet stroke(object: types.Stroke)}
    <svg
        class="elements"
        style:transform={`translate(${object.position.x}px, ${object.position.y}px)`}
    >
        <path
            d={object.path}
            stroke-linecap="round"
            fill="none"
            stroke={object.color}
            stroke-width={2 ** object.size}
        />
    </svg>
{/snippet}

{#snippet highlightStroke(object: types.Stroke)}
    <svg
        class="elements highlight"
        style:transform={`translate(${object.position.x}px, ${object.position.y}px)`}
    >
        <path
            d={object.path}
            stroke-linecap="round"
            fill="none"
            stroke-width={2 ** (object.size + 1)}
        />
    </svg>
{/snippet}

{#snippet text(object: types.Text)}
    <p class="elements">{object.text}</p>
{/snippet}

{#snippet highlightText(object: types.Text)}
    <p class="elements">{object.text}</p>
{/snippet}

<style>
    .elements {
        position: absolute;
        top: 0px;
        left: 0px;
        overflow: visible;
        pointer-events: none;
        transform-origin: top left;
    }
    .highlight {
        stroke: var(--color-primary);
        stroke-opacity: 0.7;
    }
    .eraser-trail {
        fill: #94a3b8;
        fill-opacity: 0.2;
    }
</style>
