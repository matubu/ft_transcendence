<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
</script>

<style>
	button {
		position: relative;
		width: 70px;
		height: 70px;
		border-radius: 50%;
		cursor: pointer;
		transition: .5s;
		display: grid;
		place-items: center;
		background: none;
		border: none;
	}
	button:hover {
		background: var(--hove);
	}
	button:active {
		background: var(--acti);
	}
</style>

<button
	on:click={() => dispatch('click')}
	on:mousedown={() => dispatch('mousedown')}
	on:focus={() => dispatch('focus')}
>
	<slot />
</button>