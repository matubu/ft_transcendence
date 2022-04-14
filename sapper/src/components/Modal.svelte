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
		background: #0f0f1c;
		padding: 30px;
		border-radius: 10px;
		width: 100%;
		min-width: 200px;
		max-width: 500px;
		display: flex;
		flex-direction: column;
		gap: 30px;
		box-sizing: border-box;
	}
	.card > :global(*) {
		margin: 0;
	}

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
		transition: display 0s .3s;
	}
	.closed {
		display: none;
	}
	.backdrop {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgb(4 4 4 / 71%);
		z-index: -1;
		animation: forwards modal-backdrop-fade .3s ease-in-out;
	}

	.card {
		overflow: auto;
		max-height: 100%;
		animation: forwards modal-card-fade .2s ease-in-out;
	}
	@keyframes modal-backdrop-fade {
		0% {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	@keyframes modal-card-fade {
		0% {
			opacity: 0;
			transform: scale(0);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
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
	<div class="card">
		<slot />
	</div>
	<div class="backdrop" on:click={() => close()}></div>
</div>