<script lang="ts">
    import "../../../../app.css";
    import type { StrokeElement } from "./stroke_element.svelte";
    let { object }: { object: StrokeElement } = $props();
</script>

<svg
    class="elements highlight"
    style:transform={`translate(${object.position.x}px, ${object.position.y}px)`}
>
    <path
        d={object.path}
        stroke-linecap="round"
        fill="none"
        stroke-width={object.thickness / 3}
    />
</svg>

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
        stroke: white;
        stroke-opacity: 1;
    }
</style>
