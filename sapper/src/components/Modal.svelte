<script lang="ts">
	export let opened = false

	export function toggle(_opened = !opened) {
		opened = _opened
	}
	export function close() { toggle(false) }
	export function open() { toggle(true) }
</script>

<style>
	.card {
		background: var(--fore);
		padding: 20px;
		border-radius: 10px;
		width: 100%;
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
	}
	.closed {
		opacity: 0;
		pointer-events: none;
	}
	.backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
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