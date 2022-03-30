<script>
	import Layout from '@components/Layout.svelte'
	import Head from '@components/Head.svelte'
	import Button from '@components/Button.svelte'
	import Room from '@components/Room.svelte'
	import Modal from '@components/Modal.svelte'
	import { user, useMediaQuery } from '@lib/store'
	import { logIn } from '@lib/utils'
	import { onMount } from 'svelte'
	import { writable } from 'svelte/store';

	let modalNewChat
	let formNewChat

	let mediaQuery
	onMount(() => {
		mediaQuery = useMediaQuery('(max-width: 800px)')
	})

	let rooms = writable([])

	const reloadChatList = async () => {
		let res = await fetch('/api/channels')
		let json = await res.json()
		rooms.set(json)
	}
	if (typeof document !== 'undefined')
		reloadChatList()
</script>

<style>
	.container {
		display: grid;
		gap: 20px;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
	}
</style>

<Head title="Chat" />

<Layout>
	<div>
		<h1>Chat<span class="dim">.</span></h1>

		{#if ($user)}
			<div class="container">
				{#each $rooms as {id, name, description, password, private: mode}}
					<Room id={+id} name="{name}" desc="{description ?? ''}" type="{password ? 'protected' : (mode ? 'private' : 'public')}" joined={true}/>
				{/each}
			</div>
		{:else}
			<p>You need to login first</p>
			<Button primary on:click={logIn}>Login</Button>
		{/if}
	</div>
</Layout>

{#if ($user)}
<Button float primary on:click={() => modalNewChat.open()}>
	{#if ($mediaQuery)}
	+
	{:else}
	Create room
	{/if}
</Button>
{/if}

<Modal bind:this={modalNewChat}>
	<h2>New chat</h2>
	<form bind:this={formNewChat}>
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
			Repeat password<br>
			<input type="password" placeholder="Password" name="repeatPassword">
		</label>
		<label>
			Private<br>
			<input type="checkbox" name="mode">
		</label>
	</form>
	<div style="text-align: right">
		<Button on:click={() => modalNewChat.close()}>Cancel</Button>
		<Button primary on:click={async () => {
			const { password, repeatPassword, mode, ...args } = Object.fromEntries([...formNewChat.querySelectorAll('input, textarea')].map(elm => [elm.name, elm.name === 'mode' ? elm.checked : elm.value]))
			if (password !== repeatPassword)
			{
				console.log('wrong password')
				return ;
			}
			await fetch('/api/channels', {
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ password, private: mode === 'on', ...args })
			})
			modalNewChat.close()
			reloadChatList()
		}}>Create</Button>
	</div>
</Modal>