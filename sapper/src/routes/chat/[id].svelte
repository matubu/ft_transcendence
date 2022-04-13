<script>
	import Layout from '@components/Layout.svelte'
	import Head from '@components/Head.svelte'
	import Button from '@components/Button.svelte'
	import { send } from '@lib/utils';
	import User from '@lib/components/User.svelte';
	import Message from '@lib/components/Message.svelte';

	let msg
	let id_room

	let messages = []
	let userInfo = new Map<number, any>()


	const reloadChat = async () => {
		let res = await fetch(`/api/channel/${id_room}`, {method: "POST"})
		if (!res.ok) return ;
		let json = await res.json()
		messages = json.msgs
		let infos = json.users
		for (const info of infos)
			userInfo.set(info.id, info)
	}
	if (typeof document !== 'undefined')
	{
		id_room = +location.pathname.split('/')[2]
		reloadChat()
		// setInterval(reloadChat, 10000)
		//TODO remove listener
	}
	const addMessage = (msg) => {
		userInfo.set(msg.userId, msg.user)
		messages = [...messages, msg];
	};
</script>

<style>
	:global(html) {
		overflow: hidden;
	}
	:global(body) {
		height: 100vh;
	}
</style>

<Head title="Chat" />

<svelte:window on:wsmsg={e => {
	const { channel, data } = e.detail
	console.log('here in svelte:window', channel, data)
	addMessage( data );
}}/>

<Layout>
	{#each messages as msg}
		<Message user={userInfo.get(msg.userId)} message={msg.msg}/>
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
