<script lang="ts">
	import IconButton from "./IconButton.svelte"
	import User from './User.svelte'

	let container
	let blur: Boolean
</script>

<style>
	.bubble {
		position: absolute;
		width: 10px;
		height: 10px;
		right: 18px;
		top: 16px;
		background: var(--red);
		border-radius: 50%;
	}
	.bubble:not(.active) {
		display: none;
	}
	.notif {
		position: absolute;
		background: var(--fore);
		border-radius: 5px;
		top: 75px;
		right: 0;
		width: 300px;
		padding: 15px;
		display: flex;
		flex-direction: column;
		gap: 5px;
		transition: .1s;
		box-shadow: 0 0 20px #ffffff05;
		font-size: 15px;
		z-index: 9999;
		max-height: 50vh;
		overflow-y: auto;
		scrollbar-color: var(--grey);
		scrollbar-width: thin;
	}
	::-webkit-scrollbar { width: 5px }
	::-webkit-scrollbar-track { background: #0000 }
	::-webkit-scrollbar-thumb { background: var(--grey) }

	.notif a {
		text-decoration: none;
		text-align: left;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 10px;
	}
	.container {
		position: relative;
		gap: 5px;
	}
	.container:not(:focus-within) .notif
	{
		opacity: 0;
		pointer-events: none;
	}
</style>

<div class="container" bind:this={container}>
	<IconButton
		on:mousedown={() => {
			blur = document.activeElement == container.firstChild
			container.firstChild.blur()
		}}
		on:focus={() => blur && container.firstChild.blur()}
	>
		<svg height="35" width="35" viewBox="0 0 24 24" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/></svg>
		<div class="bubble"></div>
	</IconButton>
	<div class="notif">
		<a href="/invite/[uuid]">
			<User username="matubu" />
			<span><strong>matubu</strong> invited you</span>
		</a>
		<a href="/invite/[uuid]">
			<User username="test" />
			<span><strong>test</strong> invited you</span>
		</a>
	</div>
</div>