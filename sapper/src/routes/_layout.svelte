<script context="module">
	import { fetchUser } from '@lib/utils'

	export async function preload(page, session) {
		if (typeof document === 'undefined')
		{
			if (session.user === undefined)
				user.set(undefined)
			else
				fetchUser(session.user, this.fetch)
		}
	}
</script>

<script>
	import Header from '@components/Header.svelte'
	import Modal from '@components/Modal.svelte'
	import Button from '@components/Button.svelte'
	import { user, twoauth } from '@lib/store';

	export let segment: string
	let input
</script>

<Header {segment} />

<slot />

<Modal bind:this={$twoauth}>
	<h2>Two auth code</h2>
	<div class="input" bind:this={input}>
		<input type="text">
		<input type="text">
		<input type="text">
		-
		<input type="text">
		<input type="text">
		<input type="text">
	</div>
	<div style="text-align: right">
		<Button on:click={() => $twoauth.close()}>Cancel</Button>
		<Button primary on:click={async () => {
			console.log([...input.children].reduce((acc, num) => acc + num, ''))
			let res = await fetch('/api/users/check_code', {
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					code: [...input.children].reduce((acc, num) => acc + num, '')
				})
			})
			if (!res.ok)
				return ;
			$twoauth.close()
			fetchUser()
		}}>Verify</Button>
	</div>
</Modal>