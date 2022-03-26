<script lang="ts">
	import Head from '../components/Head.svelte'
	import Button from '../components/Button.svelte'
	import { user } from '../store'
	import { logIn } from '../user';
</script>

<Head title="Watch" />

<div>
	<h1>Watch<span class="dim">.</span></h1>
	
	{#if ($user)}
		<Button primary>Watch now</Button>
	{:else}
		<p>You need to login first</p>
		<Button primary on:click={logIn}>Login</Button>
	{/if}
</div>