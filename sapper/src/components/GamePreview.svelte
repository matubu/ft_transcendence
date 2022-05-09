<style>
	.bord-card {
		overflow: hidden;
		flex-direction: column;
		padding: 0;
		gap: 0;
	}
	hr {
		width: 100%;
		border-color: var(--bord);
		margin: 0;
	}
	.viewer-count {
		padding: 10px 15px;
		margin-right: auto;
	}
	.bord-card :global(:is(header, .vs)) {
		display: none;
	}
	.bord-card :global(:is(.container, .arena-container)) {
		width: 100%;
	}
	.bord-card :global(.arena-container) {
		cursor: pointer;
	}
	.bord-card :global(.arena) {
		width: 100%;
		height: unset;
		aspect-ratio: 3 / 2;
		position: relative;
		border: none;
	}
</style>

<script>
	import Game from '@components/Game.svelte'
	import User from '@components/User.svelte'
	import { onMount } from 'svelte'

	export let gameId = 32
	export let players = [
		{
			nickname: 'Test',
			picture: {
				url: 'https://www.mairie-francheville69.fr/wp-content/uploads/2017/11/image-test-1.jpeg'
			}
		},
		{
			nickname: 'Terminator',
			picture: {
				url: 'https://intelligence-artificielle.com/wp-content/uploads/2022/03/Terminator-3.jpg'
			}
		}
	]
	export let score = [0, 0]

	let game

	onMount(() => {
		game.loadGame(score, players)
	})
</script>

<div class="bord-card">
	<Game bind:this={game} />
	<hr>
	<div class="viewer-count">
		<User user={players[0]} />
		<User user={players[1]} />
	</div>
</div>