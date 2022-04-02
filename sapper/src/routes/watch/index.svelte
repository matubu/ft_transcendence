<script>
	import Layout from '@components/Layout.svelte'
	import Head from '@components/Head.svelte'
	import Button from '@components/Button.svelte'
	import { user, waitingLogin } from '@lib/store'
	import { logIn } from '@lib/utils';
</script>

<Head title="Watch" />

<Layout>
	<h1>Watch<span class="dim">.</span></h1>
	
	{#if ($user)}
		<div class="grid-layout">
			<div class="glass-card"></div>
		</div>
	{:else}
		<p>You need to login first</p>
		<Button primary loading={$waitingLogin} on:click={logIn}>Login</Button>
	{/if}
</Layout>