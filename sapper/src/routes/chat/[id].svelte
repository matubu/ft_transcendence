<script>
	import Layout from '@components/Layout.svelte'
	import Head from '@components/Head.svelte'
	import { send } from '@lib/utils';
	import IconButton from '@lib/components/IconButton.svelte';
	import Message from '@lib/components/Message.svelte';
	import { afterUpdate } from 'svelte';

	let msg
	let id_room
	let container: HTMLDivElement

	let messages = []
	let userInfo = new Map<number, any>()

	const loadChat = async () => {
		let res = await fetch(`/api/channel/${id_room}`, {method: "POST"})
		if (!res.ok) return ;
		let json = await res.json()
		messages = json.msgs
		let infos = json.users
		for (const info of infos)
			userInfo.set(info.id, info)
	}
	const addMessage = (msg) => {
		userInfo.set(msg.userId, msg.user)
		messages = [...messages, msg]
	}

	afterUpdate(() => container.scrollTo(0, container.scrollHeight))

	if (typeof document !== 'undefined')
	{
		id_room = +location.pathname.split('/')[2]
		loadChat()
	}
</script>

<style>
	:global(html, main) {
		overflow: hidden !important;
	}
	:global(body) {
		height: 100vh;
	}
	.container {
		display: flex;
		flex-direction: column;
		gap: 10px;
		flex: 1;
		overflow-y: auto;
	}

	form {
		display: flex;
		align-items: center;
		gap: 10px;
	}
	form > input {
		flex: 1;
		max-width: none;
	}
</style>

<Head title="Chat" />

<svelte:window on:wsmsg={e => {
	const { channel, data } = e.detail
	channel === 'chat' && addMessage(data);
}}/>

<Layout>
	<div class="container" bind:this={container}>
		{#each messages as msg}
			<Message user={userInfo.get(msg.userId)} message={msg.msg}/>
		{/each}
	</div>
	<form on:submit={async e => {
		e.preventDefault()
		msg.value = msg.value.trim();
		if (!msg.value) return;
		send('chat', { room: id_room, msg: msg.value });
		msg.value = ''
	}}>
		<input type="text" bind:this={msg} placeholder="Write a message">
		<IconButton>
			<svg xmlns="http://www.w3.org/2000/svg" height="35" width="35" viewBox="0 0 24 24" fill="var(--primary)"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M3.4 20.4l17.45-7.48c.81-.35.81-1.49 0-1.84L3.4 3.6c-.66-.29-1.39.2-1.39.91L2 9.12c0 .5.37.93.87.99L17 12 2.87 13.88c-.5.07-.87.5-.87 1l.01 4.61c0 .71.73 1.2 1.39.91z"/></svg>
		</IconButton>
	</form>
</Layout>
