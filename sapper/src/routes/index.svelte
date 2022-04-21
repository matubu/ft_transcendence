<script>
	import Head from '@components/Head.svelte'
	import Button from '@components/Button.svelte'
	import AnimatedGradient from '@components/AnimatedGradient.svelte'
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { user, waitingLogin } from '@lib/store'
	import { logIn } from '@lib/utils';
	import Layout from '@lib/components/Layout.svelte';

	let mounted
	onMount(() => mounted = true)
</script>

<style>
	.hero {
		flex: 1;
		display: grid;
		place-items: center;
		text-align: center;
	}
	
	p {
		font-size: clamp(16px, 4vw, 1.5rem);
		cursor: text;
		max-width: 700px;
		gap: 10px;
		opacity: .75;
		line-height: 1.5;
		margin: 0;
		margin-bottom: 60px;
	}

	p span {
		display: inline-block;
		margin-right: 12px;
	}
</style>

<Head title="Home" />

<Layout>
	{#if mounted}
		<div class="hero">
			<div>
				<h1>Transcendence</h1>
				<p>
					{#each `Transcendence is a simple multiplayer tennis table game.
The player controls a paddle by moving it vertically.
The goal is to reach eleven points first.
Points are earned when the other fails to return the ball.`.split(/\s/) as c, idx}
						<span in:fly={{ x: 10, y: -6, duration: 200, delay: idx * 70 }}>{c}</span>
					{/each}
				</p>
				{#if ($user)}
					<Button primary href="/play">Play now</Button>
				{:else}
					<Button primary loading={$waitingLogin} on:click={logIn}>Login</Button>
				{/if}
			</div>
		</div>
	{/if}
</Layout>

<AnimatedGradient />