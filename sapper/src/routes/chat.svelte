<script>
	import Layout from '@components/Layout.svelte'
	import Head from '@components/Head.svelte'
	import Button from '@components/Button.svelte'
	import Room from '@components/Room.svelte'
	import Modal from '@components/Modal.svelte'
	import { user, useMediaQuery } from '@lib/store'
	import { logIn } from '@lib/utils'
	import { onMount } from 'svelte'

	let modalNewChat
	let formNewChat

	let mediaQuery
	onMount(() => {
		mediaQuery = useMediaQuery('(max-width: 800px)')
	})
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
				<Room name="hello world" desc="description." type="public"/>
				<Room name="test2" desc="description: hello world" type="protected" joined={true}/>
				<Room name="test" desc="wow" type="private" joined={true}/>
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
			<textarea cols="30" rows="10" name="desc"></textarea>
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
			<input type="checkbox" name="private">
		</label>
	</form>
	<div style="text-align: right">
		<Button on:click={() => modalNewChat.close()}>Cancel</Button>
		<Button primary on:click={async () => {
			const { password, repeatPassword, ...args } = Object.fromEntries([...formNewChat.querySelectorAll('input, textarea')].map(elm => [elm.name, elm.value]))
			if (password !== repeatPassword)
			{
				console.log('wrong password')
				return ;
			}
			console.log({ password, ...args })
			await fetch('/api/channels', {
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ password, ...args })
			})
		}}>Create</Button>
	</div>
</Modal>