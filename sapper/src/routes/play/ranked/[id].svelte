<script>
	import Layout from '@components/Layout.svelte'
	import { send } from '@lib/utils'
	import { onMount } from 'svelte'
	import { goto } from '@sapper/app'

	onMount(() => send('peer2peer', [location.pathname.split('/')[3], 'test']))
</script>

<svelte:window
	on:wsmsg={e => {
		const { channel, data } = e.detail
		console.log('receive', channel, data)
		if (channel === 'peer2peer')
		{

		}
		if (channel === 'rankedExpired')
			goto('/play/ranked')
	}}
/>

<Layout>
</Layout>