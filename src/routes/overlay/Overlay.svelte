<script>
    import Toolbar from "./Toolbar.svelte";
</script>

<div class="overlay"></div>

<style>
    .overlay {
        position: absolute;
        display: grid;
        /* width: 100%; */
        /* height: 100%; */
        /* top: 0; */
        /* left: 0; */
        bottom: 0;
        left: 50%;
        transform: translate(-50%, -100%);
    }
</style>
