<script lang="ts">
    import type { Rect } from "../../logic/math/vector";
    const { frame }: { frame: Rect } = $props();
</script>

<div
    class="selection-marquee"
    style:left="{frame.left}px"
    style:top="{frame.top}px"
    style:width="{frame.right - frame.left}px"
    style:height="{frame.bottom - frame.top}px"
></div>

<style>
    .selection-marquee {
        position: absolute;
        border: 1px dashed var(--color-primary);
        background-color: var(--color-primary);
        opacity: 0.1;
    }
</style>
