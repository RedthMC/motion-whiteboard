<script lang="ts">
    import type { AppStateManager } from "../editor/elements/tools/datastorage.svelte";
    const { app }: { app: AppStateManager } = $props();


    function switchToolCallback(tool: string) {
        return () => app.toolManager.switchTool(tool);
    }
</script>


<div>
    <button onclick={switchToolCallback("brush")} >
        Draw
    </button>
    <button onclick={switchToolCallback("eraser")} >
        Eraser
    </button>
    <button>
        Text
    </button>
    <button>
        Image
    </button>
</div>


<style>
    div {
        position: absolute;
        left: 50%;
        bottom: 10%;
        transform: translate(-50%);
    }
</style>