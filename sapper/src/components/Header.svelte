<script>
	import Button from '@components/Button.svelte'
	import IconButton from '@components/IconButton.svelte'
	import Notification from '@components/Notification.svelte'
	import User from '@components/User.svelte'
	import Nav from '@components/Nav.svelte'
	import { user, useMediaQuery, waitingLogin } from '@lib/store'
	import { logIn } from '@lib/utils';

	export let segment: string

	let mediaQuery = useMediaQuery('(max-width: 800px)')
</script>

<style>
	header, header > div {
		display: flex;
		align-items: center;
		gap: 20px;
	}
	header {
		justify-content: space-between;
	}

	#logo a {
		display: flex;
		align-items: center;
		color: var(--grey);
		text-decoration: none;
		font-size: 20px;
	}
	#logo span {
		font-size: 25px;
	}

	#inner {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		padding: 50px;
		box-sizing: border-box;
		background: var(--fore);
		z-index: 10000;
		transition: .35s cubic-bezier(0.68, 0.06, 0.35, 0.99);
		transform: translate(-100%)
	}
	#menu:focus-within #inner {
		transform: translate(0);
	}
	#user {
		display: flex;
		align-items: center;
		gap: 20px;
		font-size: 20px;
		text-decoration: none;
		flex: 1;
	}
	#top {
		display: flex;
		align-items: center;
		margin-bottom: 40px;
	}

	@media (max-width: 800px) {
		#logo span { display: none }
	}
	@media (max-width: 450px) {
		#top {
			flex-direction: column-reverse;
			align-items: start;
			gap: 20px;
		}
	}
	@media (max-width: 350px) {
		#logo { display: none }
	}
</style>

<header>
	{#if ($mediaQuery)}
	<div id="menu">
			<div id="button">
				<IconButton alt="menu">
					<svg height="35" width="35" viewBox="0 0 24 24" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
				</IconButton>
			</div>
			<div id="inner">
				<div id="top">
					{#if ($user)}
						<a id="user" href="/user" rel=prefetch  on:mouseup={e => e.target.blur()}>
							<User user={$user} size=50 />
							{$user.nickname ?? $user.fullname.split(' ')[0]}
						</a>
					{/if}
					<div>
						<IconButton alt="close" on:focus={e => e.detail.target.blur()}>
							<svg height="35" width="35" viewBox="0 0 24 24" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
						</IconButton>
					</div>
				</div>
				<Nav vertical {segment} on:mouseup={e => e.detail.target.blur()} />
			</div>
		</div>
	{/if}
	<div id="logo">
		<a href="/" rel="prefetch" aria-label="home">
			<img src="./logo.svg" alt="transcendence logo" width="100" height="100">
			<span>Transcendence</span>
		</a>
	</div>
	<div>
		{#if !($mediaQuery)}
			<Nav {segment} />
		{/if}
		{#if ($user)}
			<Notification />
			{#if !($mediaQuery)}
				<User user={$user} href="/user" />
			{/if}
		{:else}
			<Button primary loading={$waitingLogin} on:click={logIn}>Login</Button>
		{/if}
	</div>
</header>