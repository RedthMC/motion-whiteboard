<script lang="ts">
    import type { AppState } from "../logic/data.svelte";
    const { app }: { app: AppState } = $props();
</script>

<div>
    <button onclick={() => app.switchTool("brush")}> Draw </button>
    <button onclick={() => app.switchTool("eraser")}> Eraser </button>
    <button onclick={() => app.switchTool("pan")}> Pan </button>
    <button> Text </button>
    <button> Image </button>
</div>

<style>
    div {
        position: absolute;
        left: 50%;
        bottom: 10%;
        transform: translate(-50%);
    }
</style>
