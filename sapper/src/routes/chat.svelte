<script>
	import Layout from '@components/Layout.svelte'
	import Head from '@components/Head.svelte'
	import Button from '@components/Button.svelte'
	import Room from '@components/Room.svelte'
	import { user, useMediaQuery } from '@lib/store'
	import { logIn } from '@lib/utils'
	import { onMount } from 'svelte'

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
<Button float primary>
	{#if ($mediaQuery)}
	+
	{:else}
	Create room
	{/if}
</Button>
{/if}