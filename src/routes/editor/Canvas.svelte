<script lang="ts">
    import { renderElement } from "./elements/Snippets.svelte";
    import type { AppStateManager } from "./elements/tools/datastorage.svelte";
            
    const { app }: { app: AppStateManager } = $props();

</script>

<div class="tl-html-layer" style:transform={app.camera.tranformationStyle}>
    {#each app.elementManager.elements as element, index (element)}
        {@render renderElement(element)}
    {/each}
    <!-- {#if comp}
        {@render renderElement(comp)}
    {/if} -->
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
