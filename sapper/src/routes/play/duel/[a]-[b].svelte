<script>
	import Layout from '@components/Layout.svelte'
	import Head from '@components/Head.svelte'
	import { stores } from '@sapper/app'
	import { send } from '@lib/utils'
	
	import { user } from '@lib/store'
	import Button from '@lib/components/Button.svelte';

	const { page } = stores()

	let copyUrl = (e) => {
		navigator.clipboard.writeText(window.location.href);
	}

	let { a, b } = $page.params
	a = +a
	b = +b
	console.log(`a: ${a}, b: ${b} user: ${$user.id}`)
	if (a != b) {
		if (a == $user.id) {
			console.log("requesting")
			send("duelRequest", {oppId: b})
		} else if (b == $user.id) {
			console.log("accepting")
			send("duelAccept", {oppId: a})
		}
	}
</script>

<Head title="Duel" />

<Layout>
	<h2>Waiting for opponent...</h2>
	<Button on:click={(e) => copyUrl(e)}>
		Copy url
	</Button>
</Layout>