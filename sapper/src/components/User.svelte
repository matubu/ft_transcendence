<script>
	import { createEventDispatcher } from 'svelte'

	export let user = undefined
	export let href: string = undefined
	export let size: number | string = 50

	const dispatch = createEventDispatcher()
</script>

<style>
	div, a, img {
		width: var(--size);
		height: var(--size);
		border-radius: 50%;
		object-fit: cover;
	}
	/* div {
		padding: 3px;
		border: 3px solid var(--gree);
		border-radius: 50%;
	} */
</style>

{#if user}
	<div style="--size: {size}px" on:click={() => dispatch('click')}>
		{#if href}
			<a href={href}>
				<img src="{user.picture?.url}" alt="">
			</a>
		{:else}
			<img src="{user.picture?.url}" alt="">
		{/if}
	</div>
{/if}