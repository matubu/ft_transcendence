<script context="module">
	export async function preload(page, session) {
		if (typeof document === 'undefined' && session.user === undefined)
			this.redirect(307, '/')
	}
</script>

<script>
	import Header from '@components/Header.svelte'
	import Guard from '@components/Guard.svelte'

	import { fly } from 'svelte/transition';

	import { stores } from '@sapper/app'
	const { page } = stores()
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

<Header />

{#key $page.path}
	<Guard>
		<main in:fly={{ x: -30, duration: 300 }}>
			<slot />
		</main>
	</Guard>
{/key}