<script lang="ts">
	import { createEventDispatcher } from 'svelte'

	export let username: string = ''
	export let href: string = undefined
	export let size: number | string = 50

	const dispatch = createEventDispatcher()

	function color(str: string = '') {
		let hash = 0
		for (let c of str)
			hash = c.charCodeAt(0) + ((hash << 5) - hash)
		hash *= 424242
		return `#${(hash & 0xffffff).toString(16).padStart(6, '0')}`
	}

</script>

<style>
	a {
		width: var(--size);
		height: var(--size);
		color: #000;
		display: grid;
		place-items: center;
		font-size: calc(var(--size) / 2);
		line-height: 1;
		user-select: none;
		text-decoration: none;
		border-radius: 50%;
		background: linear-gradient(0deg, #2336eb, var(--color));
	}
	/* div {
		padding: 3px;
		border: 3px solid var(--gree);
		border-radius: 50%;
	} */
</style>

<!-- <div> -->
	<a on:click={() => dispatch('click')} style="--color: {color(username)}; --size: {size}px" href={href}>{username && username.length > 0 ? username[0] : ''}</a>
<!-- </div> -->