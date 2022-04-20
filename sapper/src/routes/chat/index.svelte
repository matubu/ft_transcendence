<script>
	import Layout from '@components/Layout.svelte'
	import Head from '@components/Head.svelte'
	import Button from '@components/Button.svelte'
	import Room from '@components/Room.svelte'
	import Modal from '@components/Modal.svelte'
	import { useMediaQuery } from '@lib/store'
	import { writable } from 'svelte/store';

	let modalNewChat
	let formNewChat

	let mediaQuery = useMediaQuery('(max-width: 800px)')

	let rooms = writable([])

	const reloadChatList = async () => {
		let res = await fetch('/api/channel')
		if (!res.ok) return ;
		let json = await res.json()
		rooms.set(json)
	}
	if (typeof document !== 'undefined')
		reloadChatList()
</script>

<style>
</style>

<Head title="Chat" />

<Layout>
	<div class="vflex">
		{#if $rooms?.length}
			{#each $rooms as {id, name, password_is_set, private: mode, description: desc}}
				<Room id={id} name="{name}" type="{password_is_set ? 'protected' : (mode ? 'private' : 'public')}" {desc}/>
			{/each}
		{:else}
			<p class="dim">No rooms yet</p>
		{/if}
	</div>
</Layout>

<Button float primary on:click={() => modalNewChat.open()}>
	{#if ($mediaQuery)}
	+
	{:else}
	Create room
	{/if}
</Button>

<Modal bind:this={modalNewChat}>
	<h2>New chat</h2>
	<form bind:this={formNewChat} on:submit={async e => {
		e.preventDefault()
		console.log('submit')
		const { password, mode, ...args } = Object.fromEntries([...formNewChat.querySelectorAll('input, textarea')].map(elm => [elm.name, elm.name === 'mode' ? elm.checked : elm.value]))
		await fetch('/api/channel', {
			method: "POST",
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ password, private: mode, ...args })
		})
		modalNewChat.close()
		reloadChatList()
	}}>
		<label>
			Chat name<br>
			<input type="text" placeholder="Chat name" required name="name">
		</label>
		<label>
			Description<br>
			<textarea cols="30" rows="10" name="description"></textarea>
		</label>
		<label>
			Password<br>
			<input type="password" placeholder="Password" name="password">
		</label>
		<label>
			Private<br>
			<input type="checkbox" name="mode">
		</label>
		<div style="text-align: right">
			<Button on:click={e => {
				console.log(e)
				e.preventDefault()
				modalNewChat.close()
			}}>Cancel</Button>
			<Button primary>Create</Button>
		</div>
	</form>
</Modal>