<script lang="ts">
    import type { AppState } from "../logic/data.svelte";

    const { app }: { app: AppState } = $props();
</script>

<div class="style-panel">
    <div class="color-grid">
        {#each app.styleManager.colors as color}
            <button
                class="color-btn"
                style:background-color={color}
                onclick={() => (app.styleManager.style.color = color)}
                aria-label="Select color {color}"
            >
                {#if app.styleManager.style.color === color}
                    <div class="dot"></div>
                {/if}
            </button>
        {/each}
    </div>

    <div class="separator"></div>

    <div class="size-control">
        <input
            class="slider"
            type="range"
            min={1}
            max={4}
            style:--size={1.25 ** app.styleManager.style.size}
            bind:value={app.styleManager.style.size}
        />
    </div>
</div>

<style>
    .style-panel {
        position: absolute;
        top: 2rem;
        right: 2rem;
        background: var(--color-bg);
        padding: 1rem;
        border-radius: var(--radius-panel);
        box-shadow: var(--shadow-floating);
        border: 1px solid var(--color-border);
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .color-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 0.75rem;
    }

    .color-btn {
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.1s;
    }

    .color-btn:hover {
        transform: scale(1.1);
    }

    .dot {
        width: 0.5rem;
        height: 0.5rem;
        background-color: white;
        border-radius: 50%;
        box-shadow: 0 1px 2px rgb(0 0 0 / 0.3);
    }

    .separator {
        height: 1px;
        background-color: var(--color-border);
        width: 100%;
    }

    .size-control {
        display: flex;
        align-items: center;
        margin: 0 0.5rem;
        width: calc(100% - 1rem);
        height: 1rem;
    }

    .slider {
        appearance: none;
        margin: 0;
        width: 100%;
        height: 3px;
        border-radius: 1.5px;
        accent-color: var(--color-primary);
        background: #d3d3d3; /* Keep minimal gray for track */
        cursor: pointer;
        --size: 3rem;
        transition: opacity 0.2s;
    }
    .slider::-webkit-slider-thumb:hover {
        background: var(--color-primary-hover);
    }
    .slider::-webkit-slider-thumb {
        appearance: none;
        background: var(--color-primary);
        border-radius: 50%;
        width: 0.75rem;
        height: 0.75rem;
        scale: var(--size);
    }
</style>
