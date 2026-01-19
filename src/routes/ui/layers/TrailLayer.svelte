<script lang="ts">
    import { getAppState } from "../../logic/context";
    const app = getAppState();
</script>

{#if app.trail.trailPath}
    <svg class="elements eraser-trail">
        <path d={app.trail.trailPath} />
    </svg>
{/if}

<style>
    .elements {
        position: absolute;
        top: 0px;
        left: 0px;
        overflow: visible;
        transform-origin: top left;
        pointer-events: none;
    }
    .eraser-trail {
        fill: #94a3b8;
        fill-opacity: 0.2;
    }
</style>
