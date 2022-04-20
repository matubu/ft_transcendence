<script>
	import User from '@components/User.svelte'
	import { user as current } from '@lib/store'

	export let user
	export let message: string
</script>

<style>
	p {
		display: block;
		border-radius: 20px;
		padding: 10px 17px;
		max-width: 400px;
		margin: 0;
    	word-break: break-word;
	}
	.other p {
		background: var(--fore);
	}
	.self p {
		background: var(--primary);
	}
	.self {
		flex-direction: row-reverse;
	}
	div {
		display: flex;
		gap: 10px;
	}
</style>

{#if $current.blockList.find(({ blockedId }) => blockedId === user.id)}
	<div class="other">
		<svg viewBox="0 0 24 24" width="40" height="40" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8z"/></svg>
		<p>Blocked user</p>
	</div>
{:else}
	<div class="{$current.id === user.id ? 'self' : 'other'}">
		<a href="/user/{user.id}">
			<User user={user} size="40"/>
		</a>
		<p>{message}</p>
	</div>
{/if}