<script lang="ts">
    import { getAppState } from "../../logic/context";
    import type { Select } from "../../logic/tool/select.svelte";

    const app = getAppState();
    const selection = app.selection;

    let { tool }: { tool: Select } = $props();
</script>

{#each selection.selectedElements as element (element.id)}
    <element.componentHighlight object={element} />
{/each}

{#if selection.selectedFrame}
    {@const frame = selection.selectedFrame}
    <div
        class="selection-marquee pinned"
        style:left="{frame.left}px"
        style:top="{frame.top}px"
        style:width="{frame.right - frame.left}px"
        style:height="{frame.bottom - frame.top}px"
    ></div>
{/if}

{#if tool.selectionFrame}
    {@const frame = tool.selectionFrame}
    <div
        class="selection-marquee"
        style:left="{frame.left}px"
        style:top="{frame.top}px"
        style:width="{frame.right - frame.left}px"
        style:height="{frame.bottom - frame.top}px"
    ></div>
{/if}

<style>
    .selection-marquee {
        position: absolute;
        border: 1px dashed var(--color-primary);
        background-color: var(--color-primary);
        opacity: 0.1;
    }
    .pinned {
        pointer-events: none;
    }
</style>
