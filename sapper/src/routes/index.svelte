<script lang="ts">
	import Head from '../components/Head.svelte'
	import AnimatedGradient from '../components/AnimatedGradient.svelte'
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { user } from '../store'
	import { logIn } from '../utils';

	let mounted = false
	onMount(() => mounted = true)
</script>

<style>
	.hero {
		flex: 1;
		display: grid;
		place-items: center;
    	font-size: clamp(20px, 5vw, 35px);
	}

	p {
		cursor: text;
		max-width: 700px;
		gap: 10px;
		opacity: .75;
		line-height: 1.5;
		margin: 0;
		margin-bottom: 140px;
	}

	p span {
		display: inline-block;
		margin-right: 12px;
	}

	.action {
    	font-size: clamp(15px, 4vw, 25px);
		text-decoration: underline;
		cursor: pointer;
		padding-left: 40px;
		position: relative;
	}
	.action span {
		position: absolute;
		text-decoration: none;
		left: 0;
		top: 0;
		transition: .3s;
	}
	.action:hover span {
		transform: translateX(10px);
	}
</style>

<Head title="Home" />

<AnimatedGradient />

{#if mounted}
<div class="hero">
	<div>
		<p>
			{#each `Transcendence is a simple multiplayer tennis table game.
The player controls a paddle by moving it vertically.
The goal is to reach eleven points first.
Points are earned when the other fails to return the ball.`.split(/\s/) as c, idx}
				<span in:fly={{ x: 10, y: -6, duration: 200, delay: idx * 70 }}>{c}</span>
			{/each}
		</p>
		{#if ($user)}
			<a class="action" href="/play"><span>➔ </span>Play now</a>
		{:else}
			<span class="action" on:click={logIn}><span>➔ </span>Login</span>
		{/if}
	</div>
</div>
{/if}