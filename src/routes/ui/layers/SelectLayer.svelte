<script lang="ts">
    import TextEditing from "../../logic/element/text/TextEditing.svelte";
    import type { SelectMode } from "../../logic/tool/select.svelte";

    const { selection }: { selection: SelectMode } = $props();
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

{#if selection.editingText}
    <TextEditing object={selection.editingText} />
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
