<script lang="ts">
    import { AppState } from "../logic/app.svelte";
    import Overlay from "../ui/Overlay.svelte";
    import Canvas from "./Canvas.svelte";

    const app = $state(new AppState());
    console.log("app created");
    console.log(app);
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="bg">
    <div
        class="interactions"
        style:cursor={app.toolbox.cursor}
        onpointerdown={(e) => app.toolbox.onPointerDown(e)}
        onpointermove={(e) => app.toolbox.onPointerMove(e)}
        onpointerup={(e) => app.toolbox.onPointerUp(e)}
        onwheel={(e) => app.toolbox.onWheel(e)}
        oncontextmenu={(e) => app.toolbox.onContextMenu(e)}
    ></div>
    <Canvas {app} />
    <Overlay {app} />
</div>

<style>
    .bg {
        position: relative;
        background-color: white;
        width: 100%;
        height: 100%;
        min-height: 100vh;
        user-select: none;
        overflow: hidden;
    }
    .interactions {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
</style>
