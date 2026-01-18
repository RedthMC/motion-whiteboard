<script lang="ts">
    import { AppState } from "../logic/data.svelte";
    import Toolbar from "../overlay/Toolbar.svelte";
    import Canvas from "./Canvas.svelte";

    const app = $state(new AppState());
    console.log("app created");
    console.log(app);
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
    class="bg"
    onpointerdown={(e) => app.onPointerDown(e)}
    onpointermove={(e) => app.onPointerMove(e)}
    onpointerup={(e) => app.onPointerUp(e)}
    onwheel={(e) => app.onWheel(e)}
    oncontextmenu={(e) => app.onContextMenu(e)}
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
