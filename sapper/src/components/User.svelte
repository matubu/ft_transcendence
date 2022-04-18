<script>
	import { createEventDispatcher } from 'svelte'
	import { status, user as current } from '@lib/store'
	import { addStatusListener } from '@lib/utils';

	export let user = undefined
	export let size: number | string = 50

	const dispatch = createEventDispatcher()

	if (user.id !== $current?.id)
		addStatusListener(user.id)
</script>

<style>
	div, img {
		border-radius: 50%;
	}
	div {
		padding: 3px;
		width: var(--size);
		height: var(--size);
		box-sizing: border-box;
	}
	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.online, .in-game {
		border: 2px solid var(--gree);
		border-radius: 50%;
	}
	.in-game { border-color: var(--blue) }
</style>

{#if user}
	<div style="--size: {size}px" on:click={() => dispatch('click')} class={$status[user.id]}>
		<img src="{user.picture?.url}" alt="">
	</div>
{/if}