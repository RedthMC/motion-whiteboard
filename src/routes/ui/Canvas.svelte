<script lang="ts">
    import { getAppState } from "../logic/context";
    import TextEditing from "../logic/element/text/TextEditing.svelte";
    import SelectLayer from "./layers/SelectLayer.svelte";
    import TrailLayer from "./layers/TrailLayer.svelte";

    const app = getAppState();
</script>

<div class="element-layer" style:transform={app.camera.tranformationStyle}>
    {#each app.elements as element (element.id)}
        {#if element !== app.selection.editingText}
            <element.component object={element} />
        {/if}
    {/each}

    <TrailLayer />

    <!-- Polymorphic Tool Layers -->
    {#if app.toolbox.currentMode.type === "select"}
        <SelectLayer />
    {/if}

    {#if app.selection.editingText}
        <TextEditing object={app.selection.editingText} />
    {/if}
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
