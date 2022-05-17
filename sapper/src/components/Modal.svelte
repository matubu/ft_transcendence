<script>
	import { createEventDispatcher, tick } from 'svelte'

	const dispatch = createEventDispatcher()

	export let opened = false

	export function toggle(_opened = !opened) {
		opened = _opened
		tick().then(() => {
			if (opened)
				dispatch('open')
			else
				dispatch('close')
			dispatch('toggle')
		})
	}
	export function close() { toggle(false) }
	export function open() { toggle(true) }
</script>

<style>
	.card > div,
	.card > div > :global(form) {
		display: flex;
		flex-direction: column;
		gap: 30px;
	}
	.card > div > :global(*),
	.card > div > :global(form > *) {
		margin: 0;
	}

	.modal {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		display: grid;
		place-items: center;
		z-index: 999999;
		padding: 20px;
		box-sizing: border-box;
		transition: display 0s .3s;
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
		display: block;
		width: 100%;
		min-width: 200px;
		max-width: 500px;
		box-sizing: border-box;
		max-height: 100%;
		animation: forwards modal-card-fade .2s ease-in-out;
	}
	.scroll {
		max-height: calc(100vh - 100px);
		overflow: auto;
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

	.card :global(label) {
		display: flex;
		flex-direction: column;
		gap: 10px;
		font-size: 20px;
	}
</style>

<svelte:window on:keydown={e => e.key === 'Escape' && close()} />

<div class="modal" style="{!opened && 'display: none'}">
	<div class="card">
		{#if opened}
			<div class="scroll">
				<slot />
			</div>
			<div>
				<slot name="hidden" />
			</div>
		{/if}
	</div>
	<div class="backdrop" on:click={() => close()}></div>
</div>