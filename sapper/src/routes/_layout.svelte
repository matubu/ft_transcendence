<script lang="ts" context="module">
	import { user } from '@lib/store'
	import { updateUser } from '@lib/utils'

	export async function preload(page, session) {
		console.log('preload _layout')
		if (typeof document === 'undefined')
			user.set(session.user)
		else
			updateUser()
	}
</script>

<script lang="ts">
	import Header from '@components/Header.svelte'
	import { fly } from 'svelte/transition';
	import { stores } from '@sapper/app'
	const { page } = stores()

	export let segment: string
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
	}
</style>

<Header {segment} />

{#key $page.path}
	<main
		in:fly={{ x: -30, duration: 300 }}
	>
		<slot />
	</main>
{/key}