<script lang="ts">
	import { createEventDispatcher } from 'svelte'

	export let user = undefined
	export let href: string = undefined
	export let size: number | string = 50

	const dispatch = createEventDispatcher()
</script>

<style>
	a, img {
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
	<!-- <div> -->
		<a on:click={() => dispatch('click')} style="--size: {size}px" href={href}>
			<img src="{user.img}" alt="{user.fullname} profile picture">
		</a>
	<!-- </div> -->
{/if}