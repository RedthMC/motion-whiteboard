<script lang="ts">
    import type { AppState } from "../logic/app.svelte";
    import { renderElement } from "./elements/Snippets.svelte";

    const { app }: { app: AppState } = $props();
</script>

<div class="tl-html-layer" style:transform={app.camera.tranformationStyle}>
    {#each app.elements as element (element.id)}
        {@render renderElement(element)}
    {/each}
</div>

<style>
    .tl-html-layer {
        position: relative;
        top: 0;
        left: 0;
        width: 0;
        height: 0;
        contain: layout style size;
    }
</style>
