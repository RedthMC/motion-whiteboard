<script lang="ts">
	import Editor from "./ui/Editor.svelte";
</script>

<svelte:head>
	<title>Motion Whiteboard</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<Editor />
</section>

<style>
	section {
		display: block;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}
</style>
