<script lang="ts">
    import { getAppState } from "../logic/context";
    import TrailLayer from "./layers/TrailLayer.svelte";

    const app = getAppState();
    const renderLayers = $derived(app.toolbox.getRenderLayers());
</script>

<div class="element-layer" style:transform={app.camera.tranformationStyle}>
    {#each app.elements as element (element.id)}
        <element.component object={element} />
    {/each}

    <TrailLayer />

    <!-- Polymorphic Tool Layers -->
    {#each renderLayers as layer}
        <layer.component {...layer.data} />
    {/each}
</div>

<style>
    .element-layer {
        position: relative;
        top: 0;
        left: 0;
        width: 0;
        height: 0;
        pointer-events: none;
        transition: transform 75ms ease-out;
        contain: layout style size;
    }
</style>
