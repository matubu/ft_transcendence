<script lang="ts">
	import { onMount, onDestroy } from "svelte";

	let container

	onMount(() => document.body.append(container))
	onDestroy(() => container?.remove?.())
</script>

<div bind:this={container}>
	<slot />
</div>