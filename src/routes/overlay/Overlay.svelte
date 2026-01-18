<script lang="ts">
    import Toolbar from "./Toolbar.svelte";
    import StylePanel from "./StylePanel.svelte";
    import "./theme.css";
    import type { AppState } from "../logic/data.svelte";

    const { app }: { app: AppState } = $props();
</script>

<StylePanel {app} />
<Toolbar {app} />
