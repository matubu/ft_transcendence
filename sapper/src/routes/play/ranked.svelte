<script>
	import { onDestroy, onMount } from "svelte"
	import { send } from '@lib/utils'
	import Layout from '@components/Layout.svelte'
	import Head from '@components/Head.svelte'
	import Button from '@components/Button.svelte'
	import { goto } from '@sapper/app'

	onMount(() => send('joinRanked'))
	onDestroy(() => send('leaveRanked'))
</script>

<Head title="Ranked"/>

<Layout>
	<div>
		Loader
	</div>
	<Button on:click={() => goto('/play')}>Cancel</Button>
</Layout>