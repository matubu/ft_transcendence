<script>
	import Header from '@components/Header.svelte'
	import { fly } from 'svelte/transition'

	export let maxwidth = "1200px"
</script>

<style>
	main {
		width: 100%;
		overflow-y: auto;
	}
	main > div {
		width: 100%;
		margin: 0 auto;
		position: relative;
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 20px;
		padding: 1rem;
		box-sizing: border-box;
	}
</style>

<Header />

<main
	in:fly={{ x: -30, duration: 300 }}
>
	<div
		style="max-width: {maxwidth}"
	>
		<slot />
	</div>
</main>