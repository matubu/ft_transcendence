<script>
	import IconButton from "@components/IconButton.svelte"
	import User from '@components/User.svelte'
	import { user } from '@lib/store'

	let container
	let blur: boolean
	let notifs = [];

	user.subscribe(userData => notifs = userData?.notifications ?? [])

	const readNotifs = async () => {
		let res = await fetch(`/api/notification/readAll`, { method: "PUT" })
		if (!res.ok) return ;
		notifs = notifs.map(notif => ({ ...notif, seen: true }))
	}

	async function removeOneNotification(notification_id: number) {
		const res = await fetch(`/api/notification/remove`,
			{ method: "POST",
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ notification_id }) });
		console.log("In Progress");
	}
</script>

<style>
	.bubble {
		position: absolute;
		width: 10px;
		height: 10px;
		right: 18px;
		top: 18px;
		background:
			radial-gradient(#fff0, #fff1),
			var(--red);
		border-radius: 50%;
		display: none;
	}
	.bubble.active {
		display: block;
	}
	.notif {
		position: absolute;
		background: var(--fore);
		border-radius: 5px;
		top: 75px;
		right: 0;
		width: 300px;
		padding: 15px;
		transition: .1s;
		box-shadow: 0 0 20px #ffffff05;
		font-size: 15px;
		z-index: 99999;
		max-height: 50vh;
		overflow-y: auto;
	}

	.container {
		position: relative;
		gap: 5px;
	}
	.container .notif
	{
		opacity: 0;
		pointer-events: none;
	}
	.container:focus-within .notif
	{
		opacity: 1;
		pointer-events: all;
	}

	p {
		margin: 10px;
	}

	.notif .notification {
		display: flex;
		flex-wrap: nowrap;
		flex-direction: row;
	}
</style>

<svelte:window on:wsmsg={e => {
	const { channel, data } = e.detail
	if (channel !== "notif") return ;
	notifs = [...notifs, data]
}}/>

<div class="container" bind:this={container}
	on:focusin={e => blur && container.firstChild.blur()}
>
	<IconButton
		alt="notifications"
		on:mousedown={e => {
			blur = document.activeElement == container.firstChild
			container.firstChild.blur()
			readNotifs();
		}}
	>
		<svg height="35" width="35" viewBox="0 0 24 24" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/></svg>
		<div class="bubble {notifs.filter(notif => !notif.seen).length && 'active'}"></div>
	</IconButton>
	<div class="vflex notif">
		{#if notifs.length}
			{#each [...notifs].reverse() as notif}
			<div id="notif{notif.id}" class="notification">
				<p>
					{#if notif.sender}
					<a href="/user/{notif.sender.id}">
						<User user="{notif.sender}" />
					</a>
					{/if}
					<span>{notif.msg}</span>
				</p>
				<IconButton on:click={removeOneNotification(+notif.id)}>
				<svg height="20" width="20" viewBox="0 0 24 24" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
				</IconButton>
			</div>
			{/each}
		{:else}
			<p>No notification</p>
		{/if}
	</div>
</div>
