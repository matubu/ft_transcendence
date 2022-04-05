<script>
	import { createEventDispatcher } from 'svelte'

	const dispatch = createEventDispatcher()

	export let opened = false

	export function toggle(_opened = !opened) {
		dispatch('toggle')
		if (opened = _opened)
			dispatch('open')
		else
			dispatch('close')
	}
	export function close() { toggle(false) }
	export function open() { toggle(true) }
</script>

<style>
	.modal {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: grid;
		place-items: center;
		z-index: 999999;
		padding: 20px;
		box-sizing: border-box;
	}
	.closed {
		opacity: 0;
		pointer-events: none;
	}
	.backdrop {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		backdrop-filter: brightness(.5);
		z-index: -1;
	}

	.glass-card {
		overflow: auto;
    	max-height: 100%;
	}

	.modal :global(label) {
		margin: 15px 0;
		display: flex;
		flex-direction: column;
		gap: 10px;
		font-size: 20px;
	}
</style>

<div class="modal {opened || 'closed'}">
	<div class="glass-card">
		<slot />
	</div>
	<div class="backdrop" on:click={() => close()}></div>
</div>