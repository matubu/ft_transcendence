<script context="module">
	export async function preload(page, session) {
		if (typeof document === 'undefined' && session.user === undefined)
			this.redirect(307, '/')
	}
</script>

<script>
	import { fly } from 'svelte/transition';
	import { stores, goto } from '@sapper/app'
	const { page } = stores()
	import { user } from '@lib/store'

	typeof document !== 'undefined'
		&& user.subscribe(data => data === undefined && goto('/'))
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

{#key $page.path}
	{#if ($user)}
		<main in:fly={{ x: -30, duration: 300 }}>
			<slot />
		</main>
	{/if}
{/key}