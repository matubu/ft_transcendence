<script>
	import Header from '@components/Header.svelte'
	import { fly } from 'svelte/transition'

	export let maxwidth = "1200px"
</script>

<style>
	main {
		width: 100%;
		margin: 0 auto;
		position: relative;
		flex: 1;
		display: flex;
		flex-direction: column;
		overflow-y: auto;
		gap: 20px;
	}
</style>

<Header />

<main
	in:fly={{ x: -30, duration: 300 }}
	style="max-width: {maxwidth}"
>
	<slot />
</main>