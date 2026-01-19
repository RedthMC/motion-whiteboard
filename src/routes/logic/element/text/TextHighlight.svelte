<script lang="ts">
    import "../../../../app.css";
    import type { TextElement } from "./text_element.svelte";

    let { object }: { object: TextElement } = $props();
</script>

<div
    class="elements highlight"
    style:transform={`translate(${object.position.x}px, ${object.position.y}px)`}
    style:width={`${object.width}px`}
    style:height={`${object.height}px`}
></div>

<style>
    .elements {
        position: absolute;
        overflow: visible;
        pointer-events: none;
        transform-origin: top left;
    }
    .highlight {
        border: 2px solid var(--color-primary);
        left: -2px;
        top: -2px;
        border-radius: 4px;
    }
</style>
