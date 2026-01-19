<script lang="ts">
    import "../../../../app.css";
    import type { TextElement } from "./text_element.svelte";

    let { object }: { object: TextElement } = $props();
</script>

<div
    class="elements text-element"
    contenteditable="plaintext-only"
    style:transform={`translate(${object.position.x}px, ${object.position.y}px)`}
    style:width={`${object.boundingBox.right - object.boundingBox.left}px`}
    style:color={object.color}
    style:font-size={`${object.size}px`}
    bind:textContent={object.text}
    bind:clientHeight={object.height}
></div>

<style>
    .elements {
        position: absolute;
        top: 0px;
        left: 0px;
        overflow: visible;
        pointer-events: auto;
        transform-origin: top left;
        z-index: 100;
    }
    .text-element {
        outline: none;
    }
</style>
