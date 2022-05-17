<script>
	import Layout from '@components/Layout.svelte'
	import Head from '@components/Head.svelte'
	import Button from '@components/Button.svelte'
	import Room from '@components/Room.svelte'
	import Modal from '@components/Modal.svelte'
	import Toggle from '@components/Toggle.svelte'
	import { useMediaQuery } from '@lib/store'
	import { writable, get } from 'svelte/store'
	import { fetchUser, postjson } from '@lib/utils'
	import { onMount } from 'svelte';

	let modalNewChat
	let formNewChat
	let newChatInput

	let mediaQuery = useMediaQuery('(max-width: 800px)')

	let rooms = writable([])

	const reloadChatList = async () => {
		let res = await fetch('/api/channel')
		if (!res.ok) return ;
		rooms.set(await res.json())
	}
	if (typeof document !== 'undefined')
		onMount(reloadChatList)
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

<Modal bind:this={modalNewChat} on:open={() => {
	newChatInput.focus()
}}>
	<h2>Create chat</h2>
	<form bind:this={formNewChat} on:submit={async e => {
		e.preventDefault()
		const { password, mode, ...args } = Object.fromEntries([...formNewChat.querySelectorAll('input, textarea')].map(elm => [elm.name, elm.name === 'mode' ? elm.checked : elm.value]))
		rooms.set([ await (await postjson('/api/channel', { password, private: mode, ...args })).json(), ...get(rooms) ])
		modalNewChat.close()
		fetchUser()
	}}>
		<label>
			Chat<br>
			<input type="text" placeholder="Chat name" required name="name" bind:this={newChatInput}>
		</label>
		<label>
			Description<br>
			<input type="text" placeholder="Description" name="description">
		</label>
		<label>
			Password<br>
			<input type="password" placeholder="Password" name="password">
		</label>
		<Toggle desc="Private" name="mode" />
		<div class="vflex">
			<Button primary>Create chat</Button>
			<Button on:click={e => {
				e.preventDefault()
				modalNewChat.close()
			}}>Cancel</Button>
		</div>
	</form>
</Modal>