<script>
	import Layout from '@components/Layout.svelte'
	import Head from '@components/Head.svelte'
	import { stores } from '@sapper/app'
	import { getjson, send } from '@lib/utils'
	
	import { user } from '@lib/store'
	import Button from '@lib/components/Button.svelte';
	import Confetti from '@lib/confetti'

	const { page } = stores()
	const confetti = new Confetti()

	let copyUrl = (e) => {
		navigator.clipboard.writeText(window.location.href).then(() =>
			confetti.at(e.detail.clientX, e.detail.clientY)
		);
	}

	let { a, b } = $page.params
	let oppId
	if (a != b) {
		if (a == $user.id) {
			oppId = +b
			console.log("requesting")
			send("duelRequest", {oppId})
		} else if (b == $user.id) {
			oppId = +a
			console.log("accepting")
			send("duelAccept", {oppId})
		}
	}
</script>

<Head title="Duel" />

<Layout>
	{#await getjson(`/api/user/${oppId}`)}
		<h2>Waiting for opponent...</h2>
	{:then opponent}
		<h2>Waiting for <span style="font-weight: bolder;">{opponent.nickname ?? opponent.fullname.split(' ')[0]}</span>...</h2>
	{/await}
	<Button on:click={(e) => copyUrl(e)}>
		Copy invite link
	</Button>
</Layout>