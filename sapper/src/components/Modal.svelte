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
	.card {
		background: rgba(0,0,0,0);
		border: 1px solid rgb(142 140 144 / 5%);
		box-shadow: inset 1px 1px 0 hsl(0deg 0% 100% / 11%);
		backdrop-filter: blur(52px);
		padding: 20px;
		border-radius: 10px;
		width: 100%;
		min-width: 200px;
		max-width: 500px;
		display: flex;
		flex-direction: column;
		gap: 30px;
		box-sizing: border-box;
	}
	.card :global(*) {
		margin: 0;
	}
	.modal {
		position: absolute;
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
</style>

<div class="modal {opened || 'closed'}">
	<div class="card">
		<slot />
	</div>
	<div class="backdrop" on:click={() => close()}></div>
</div>