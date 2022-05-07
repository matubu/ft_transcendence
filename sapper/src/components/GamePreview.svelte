<style>
	.bord-card {
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
		0 <svg height="24" width="24" viewBox="0 0 48 48"><path fill="currentColor" d="M24 31.5Q27.55 31.5 30.025 29.025Q32.5 26.55 32.5 23Q32.5 19.45 30.025 16.975Q27.55 14.5 24 14.5Q20.45 14.5 17.975 16.975Q15.5 19.45 15.5 23Q15.5 26.55 17.975 29.025Q20.45 31.5 24 31.5ZM24 28.6Q21.65 28.6 20.025 26.975Q18.4 25.35 18.4 23Q18.4 20.65 20.025 19.025Q21.65 17.4 24 17.4Q26.35 17.4 27.975 19.025Q29.6 20.65 29.6 23Q29.6 25.35 27.975 26.975Q26.35 28.6 24 28.6ZM24 38Q16.7 38 10.8 33.85Q4.9 29.7 2 23Q4.9 16.3 10.8 12.15Q16.7 8 24 8Q31.3 8 37.2 12.15Q43.1 16.3 46 23Q43.1 29.7 37.2 33.85Q31.3 38 24 38ZM24 23Q24 23 24 23Q24 23 24 23Q24 23 24 23Q24 23 24 23Q24 23 24 23Q24 23 24 23Q24 23 24 23Q24 23 24 23ZM24 35Q30.05 35 35.125 31.725Q40.2 28.45 42.85 23Q40.2 17.55 35.125 14.275Q30.05 11 24 11Q17.95 11 12.875 14.275Q7.8 17.55 5.1 23Q7.8 28.45 12.875 31.725Q17.95 35 24 35Z"/></svg>
	</div>
</div>