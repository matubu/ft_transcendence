<script>
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let alt: string = ''
	export let iconSize = 35
</script>

<style>
	button {
		position: relative;
		border-radius: 50%;
		cursor: pointer;
		transition: .5s;
		display: grid;
		place-items: center;
		background: none;
		border: none;
		flex-shrink: 0;
	}
	button:hover {
		background: var(--hove);
	}
	button:active {
		background: var(--acti);
	}
</style>

<button
	aria-label={alt}
	style="
	width: {iconSize * 2}px;
	height: {iconSize * 2}px;
	"
	on:click={e => dispatch('click', e)}
	on:mousedown={e => dispatch('mousedown', e)}
	on:mouseup={e => dispatch('mouseup', e)}
	on:focus={e => dispatch('focus', e)}
>
	<slot />
</button>