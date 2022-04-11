<script>
	import Layout from '@components/Layout.svelte'
	import Head from '@components/Head.svelte'
	import Button from '@components/Button.svelte'
	import { send } from '@lib/utils';

	let msg
	let id_room

	let messages = []

	const reloadChat = async () => {
		let res = await fetch(`/api/channel/${id_room}`, {method: "POST"})
		if (!res.ok) return ;
		let json = await res.json()
		messages = json
	}
	if (typeof document !== 'undefined')
	{
		id_room = +location.pathname.split('/')[2]
		reloadChat()
		// setInterval(reloadChat, 10000)
		//TODO remove listener
	}
	const addMessage = (msg) => {
		messages = [...messages, msg];
	};
</script>

<Head title="Chat" />

<svelte:window on:wsmsg={e => {
	const { channel, data } = e.detail
	console.log('here in svelte:window', channel, data)
	addMessage( {senderId: data.senderId, msg: data.msg} );
}}/>

<Layout>
	{#each messages as { senderId, msg }}
		<p>{senderId}: {msg}</p>
	{/each}

	<form on:submit={async e => {
		e.preventDefault()
		msg.value = msg.value.trim();
		if (!msg.value) return;
		send('chat', { room: id_room, msg: msg.value });
		msg.value = ''
	}}>
		<input type="text" bind:this={msg}>
		<Button primary>Send</Button>
	</form>
</Layout>
