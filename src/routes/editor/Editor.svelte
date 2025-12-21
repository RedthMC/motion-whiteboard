<script lang="ts">
    import Toolbar from "../overlay/Toolbar.svelte";
    import Canvas from "./Canvas.svelte";
    import { AppStateManager } from "./elements/tools/datastorage.svelte";

    const app = new AppStateManager();
    console.log("app created");
    console.log(app);
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
    class="bg"
    onpointerdown={(e) => app.inputHandler.onPointerDown(e)}
    onpointermove={(e) => app.inputHandler.onPointerMove(e)}
    onpointerup={(e) => app.inputHandler.onPointerUp(e)}
    onwheel={(e) => app.inputHandler.onWheel(e)}
    oncontextmenu={(e) => app.inputHandler.onContextMenu(e)}
>
    <Canvas {app} />
    <Toolbar {app} />
</div>

<style>
    .bg {
        position: relative;
        background-color: white;
        width: 100%;
        height: 100%;
        min-height: 100vh;
        user-select: none;
    }
</style>
