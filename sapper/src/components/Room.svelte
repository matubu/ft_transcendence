<script>
	import User from '@components/User.svelte'
	import { getjson } from '@lib/utils'

	export let id: string
	export let name: string
	export let type: string
	export let desc: string
</script>

<style>
	.text {
		flex: 1;
		overflow: hidden;
		margin-right: 20px;
		flex-direction: column;
		gap: 0;
		align-items: start;
	}
	h2, p {
		white-space: nowrap;
		margin: 0;
		width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.bord-card
	{ height: 50px }
	.grad-card {
		padding: 7px;
		border-radius: 14px;
		flex-grow: 0;
	}
</style>

<a class="bord-card" href="/chat/{id}">
	<div class="grad-card" style="background: var(--grad-{type == 'public' ? 'blue' : (type == 'protected' ? 'gree' : 'purp')})">
		{#if type == 'public'}
			<svg width=30 height=30 viewBox="0 0 80 80" fill="none"><path d="M40 6.66669C21.6 6.66669 6.66666 21.6 6.66666 40C6.66666 58.4 21.6 73.3334 40 73.3334C58.4 73.3334 73.3333 58.4 73.3333 40C73.3333 21.6 58.4 6.66669 40 6.66669ZM36.6667 66.4334C23.5 64.8 13.3333 53.6 13.3333 40C13.3333 37.9334 13.6 35.9667 14.0333 34.0334L30 50V53.3334C30 57 33 60 36.6667 60V66.4334ZM59.6667 57.9667C58.8 55.2667 56.3333 53.3334 53.3333 53.3334H50V43.3334C50 41.5 48.5 40 46.6667 40H26.6667V33.3334H33.3333C35.1667 33.3334 36.6667 31.8334 36.6667 30V23.3334H43.3333C47 23.3334 50 20.3334 50 16.6667V15.3C59.7667 19.2667 66.6667 28.8334 66.6667 40C66.6667 46.9334 64 53.2334 59.6667 57.9667Z" fill="currentColor"/></svg>
		{:else if type == 'protected'}
			<svg width=30 height=30 viewBox="0 0 80 80" fill="none"><path d="M70 33.3333H42.1667C39.4333 25.5667 32.0333 20 23.3333 20C12.3 20 3.33334 28.9667 3.33334 40C3.33334 51.0333 12.3 60 23.3333 60C32.0333 60 39.4333 54.4333 42.1667 46.6667H43.3333L50 53.3333L56.6667 46.6667L63.3333 53.3333L76.6667 39.8667L70 33.3333ZM23.3333 50C17.8333 50 13.3333 45.5 13.3333 40C13.3333 34.5 17.8333 30 23.3333 30C28.8333 30 33.3333 34.5 33.3333 40C33.3333 45.5 28.8333 50 23.3333 50Z" fill="currentColor"/></svg>
		{:else}
			<svg width=30 height=30 viewBox="0 0 80 80" fill="none"><path d="M60 26.6666H56.6667V20C56.6667 10.8 49.2 3.33331 40 3.33331C30.8 3.33331 23.3333 10.8 23.3333 20V26.6666H20C16.3333 26.6666 13.3333 29.6666 13.3333 33.3333V66.6666C13.3333 70.3333 16.3333 73.3333 20 73.3333H60C63.6667 73.3333 66.6667 70.3333 66.6667 66.6666V33.3333C66.6667 29.6666 63.6667 26.6666 60 26.6666ZM30 20C30 14.4666 34.4667 9.99998 40 9.99998C45.5333 9.99998 50 14.4666 50 20V26.6666H30V20ZM60 66.6666H20V33.3333H60V66.6666ZM40 56.6666C43.6667 56.6666 46.6667 53.6666 46.6667 50C46.6667 46.3333 43.6667 43.3333 40 43.3333C36.3333 43.3333 33.3333 46.3333 33.3333 50C33.3333 53.6666 36.3333 56.6666 40 56.6666Z" fill="currentColor"/></svg>
		{/if}
	</div>
	<div class="text">
		<h2>{name}</h2>
		<p class="dim">{desc}</p>
	</div>
	<div style="gap: 0">
		{#await getjson(`/api/channel/${id}/users`)}
			<span class="dim">...</span>
		{:then users}
			{#each users.slice(0, 3) as user}
				<div style="margin-left: -20px">
					<User {user} />
				</div>
			{/each}
			{#if users.length > 3}
				<span class="dim" style="margin-left: 10px">+{users.length - 3}</span>
			{/if}
		{:catch err}
			<p>Error: {err.message}</p>
		{/await}
	</div>
</a>