<script>
	import Layout from '@components/Layout.svelte'
	import Head from '@components/Head.svelte'
	import { stores, goto } from '@sapper/app'
	import { fetchUser, postjson, getjson, send } from '@lib/utils'
	
	import { user } from '@lib/store'
	import Button from '@lib/components/Button.svelte';

	const { page } = stores()
	let active = false

	let copyUrl = (e) => {
		navigator.clipboard.writeText(window.location.href);
	}

	let { a, b } = $page.params
	console.log(`a: ${a}, b: ${b} user: ${$user.id}`)
	if (a != b) {
		if (a == $user.id) {
			send("duelRequest", {oppId: b})
		} else if (b == $user.id) {
			send("duelAccept", {oppId: a})
		}
	}
</script>

<Head title="Duel" />

<Layout>
	<h2>Waiting for opponent...</h2>
	<Button on:click={(e) => copyUrl(e)}>
		<h3>Copy url</h3>
	</Button>
</Layout>