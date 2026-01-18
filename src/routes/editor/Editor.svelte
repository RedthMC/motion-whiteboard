<script lang="ts">
    import { AppState } from "../logic/data.svelte";
    import Overlay from "../overlay/Overlay.svelte";
    import Canvas from "./Canvas.svelte";

    const app = $state(new AppState());
    console.log("app created");
    console.log(app);
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="bg">
    <div
        class="interactions"
        style:cursor={app.cursor.style}
        onpointerdown={(e) => app.onPointerDown(e)}
        onpointermove={(e) => app.onPointerMove(e)}
        onpointerup={(e) => app.onPointerUp(e)}
        onwheel={(e) => app.onWheel(e)}
        oncontextmenu={(e) => app.onContextMenu(e)}
    >
        <Canvas {app} />
    </div>
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
