<script lang="ts">
	import Header from "./Header.svelte";
	import "../app.css";

	let { children } = $props();
</script>

<div class="app">
	{@render children()}
</div>

<style>
	.app {
		display: block;
		flex-direction: column;
		height: 100%;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
