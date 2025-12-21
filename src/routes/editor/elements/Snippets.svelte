<script module lang="ts">
    import type * as types from "./elements";

    type SnippetMapType = {
        [E in types.Element as E["type"]]: (
            object: E,
        ) => ReturnType<import("svelte").Snippet>;
    };

    const snippetMap: SnippetMapType = {
        stroke,
        text,
    };

    export { renderElement };
</script>

{#snippet renderElement(/* @ts-ignore */ object: types.Element)}
    {@render snippetMap[object.type](object)}
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
            stroke="black"
            stroke-width="10"
        />
        <!-- <rect
            width={object.boundingBox.end.x - object.boundingBox.start.x}
            height={object.boundingBox.end.y - object.boundingBox.start.y}
            x={object.boundingBox.start.x}
            y={object.boundingBox.start.y}
            fill="none"
            stroke="blue"
            stroke-width="2"
        /> -->
    </svg>
{/snippet}

{#snippet text(object: types.Text)}
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
</style>
