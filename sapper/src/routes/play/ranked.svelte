<script>
	import { onDestroy, onMount } from "svelte"
	import { send } from '@lib/utils'
	import Layout from '@components/Layout.svelte'
	import Head from '@components/Head.svelte'
	import Button from '@components/Button.svelte'
	import Loader from '@components/Loader.svelte'
	import { goto } from '@sapper/app'

	onMount(() => send('joinRanked'))
	onDestroy(() => send('leaveRanked'))
</script>

<style>
	.container {
		display: grid;
		place-items: center;
		height: 100%;
	}
	.container > div {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>

<Head title="Ranked"/>

<Layout>
	<div class="container">
		<div>
			<Loader />
			<Button on:click={() => goto('/play')}>Cancel</Button>
		</div>
	</div>
</Layout>