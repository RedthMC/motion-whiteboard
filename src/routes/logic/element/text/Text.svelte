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
    style:height={`${object.boundingBox.bottom - object.boundingBox.top}px`}
    style:color={object.color}
    style:font-size={`${object.size}px`}
>
    {object.text}
</div>

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
