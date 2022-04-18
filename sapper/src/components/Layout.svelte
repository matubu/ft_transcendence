<script>
	import Header from '@components/Header.svelte'
	import Guard from '@components/Guard.svelte'

	import { fly } from 'svelte/transition';
</script>

<style>
	main {
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
		position: relative;
		flex: 1;
		display: flex;
		flex-direction: column;
		overflow-y: auto;
	}
</style>

<Guard>
	<Header />

	<main in:fly={{ x: -30, duration: 300 }}>
		<slot />
	</main>
</Guard>