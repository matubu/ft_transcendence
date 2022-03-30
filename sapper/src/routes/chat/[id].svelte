<script>
	import Layout from '@components/Layout.svelte'
	import Button from '@components/Button.svelte'
	import { writable } from 'svelte/store';

	let msg
	let id_channel

	let messages = writable([])

	const reloadChat = async () => {
		let res = await fetch(`/api/messages/${id_channel}`)
		if (!res.ok) return ;
		let json = await res.json()
		messages.set(json)
	}
	if (typeof document !== 'undefined')
	{
		id_channel = +location.pathname.split('/')[2]
		reloadChat()
		setInterval(reloadChat, 10000)
	}
</script>

<Layout>
	{#each $messages as { id_user, msg }}
		<p>{id_user}: {msg}</p>
	{/each}

	<form on:submit={async e => {
		e.preventDefault()
		await fetch('/api/messages/send', {
			method: "POST",
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id_channel,
				msg: msg.value
			})
		})
		msg.value = ''
		reloadChat()
	}}>
		<input type="text" bind:this={msg}>
		<Button primary>Send</Button>
	</form>
</Layout>