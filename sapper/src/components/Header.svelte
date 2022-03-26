<script lang="ts">
	import Button from './Button.svelte'
	import IconButton from './IconButton.svelte'
	import Notification from './Notification.svelte'
	import User from './User.svelte'
	import { user } from '../store'
	import { logIn } from '../utils';

	export let segment: string
</script>

<style>
	header, header > div {
		display: flex;
		align-items: center;
		gap: 10px;
	}
	header {
		justify-content: space-between;
	}

	ul {
		margin: 30px;
		padding: 0;
		display: flex;
		gap: 20px;
	}
	li {
		display: block;
	}

	a {
		display: grid;
		place-items: center;
		gap: 5px;
		color: var(--grey);
		font-size: 20px;
		transition: .2s;
	}
	nav a:before {
		content: '';
		width: calc(1em);
		height: 2px;
		display: block;
	}
	[aria-current] {
		color: var(--whit);
	}
	[aria-current]:before {
		background: var(--whit);
	}
	a { text-decoration: none }
	a:hover { color: var(--whit) }

	#logo a {
		display: flex;
		align-items: center;
	}
	#logo span {
		font-size: 25px;
	}

	#menu { display: none; }
	@media (max-width: 800px) {
		#logo span,
		nav,
		#user {
			display: none;
		}
		#menu { display: block; }
	}
</style>

<header>
	<div id="menu">
		<IconButton>
			<svg height="35" width="35" viewBox="0 0 24 24" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
		</IconButton>
	</div>
	<div id="logo">
		<a href="/" rel=prefetch>
			<img src="./logo.svg" alt="Transcendence logo">
			<span>Transcendence</span>
		</a>
	</div>
	<div>
		<nav>
			<ul>
				<li><a rel=prefetch aria-current="{segment == 'play' ? 'page' : undefined}" href="/play">Play</a></li>
				<li><a rel=prefetch aria-current="{segment == 'chat' ? 'page' : undefined}" href="/chat">Chat</a></li>
				<li><a rel=prefetch aria-current="{segment == 'watch' ? 'page' : undefined}" href="/watch">Watch</a></li>
			</ul>
		</nav>
	
		{#if ($user)}
			<Notification />
			<div id="user"><User user={$user} href="/user" /></div>
		{:else}
			<Button primary on:click={logIn}>Login</Button>
		{/if}
	</div>
</header>