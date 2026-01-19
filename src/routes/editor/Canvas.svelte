<script lang="ts">
    import type { AppState } from "../logic/app.svelte";
    import { renderElement, renderHighlight } from "./elements/Snippets.svelte";

    const { app }: { app: AppState } = $props();
</script>

<div class="element-layer" style:transform={app.camera.tranformationStyle}>
    {#each app.elements.selectedElements as element (element.id)}
        {@render renderHighlight(element)}
    {/each}
    {#each app.elements as element (element.id)}
        {@render renderElement(element)}
    {/each}
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
</style>
