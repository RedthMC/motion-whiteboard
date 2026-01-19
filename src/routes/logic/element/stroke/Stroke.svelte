<script lang="ts">
    import "../../../../app.css";
    import type { StrokeElement } from "./stroke_element.svelte";

    let { object }: { object: StrokeElement } = $props();
</script>

<svg
    class="elements"
    style:transform={`translate(${object.position.x}px, ${object.position.y}px)`}
>
    <path
        d={object.path}
        stroke-linecap="round"
        fill="none"
        stroke={object.color}
        stroke-width={object.thickness}
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
</style>
