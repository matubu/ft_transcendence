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
	.info {
		width: 100%;
		padding: 10px 20px;
		justify-content: space-between;
		box-sizing: border-box;
		display: flex;
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

	export let gameId
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

<svelte:window on:wsmsg={e => {
	const { channel, data } = e.detail
	if (channel !== "GameData") return ;
	if (data.id !== gameId) return ;

	if (data.type === 'P')
		game.updatePaddleAbsolute(data.playerSide, data.data)
	if (data.type === 'S')
	{
		const [pos, vel, collisionId] = data.data

		if (data.playerSide)
			game.updateBall([game.WIDTH - pos[0], pos[1]], [-vel[0], vel[1]], collisionId)
		else
			game.updateBall(pos, vel, collisionId)
	}
}}/>

<div class="bord-card">
	<Game
		bind:this={game}
		syncReset={() => {}}
	/>
	<hr>
	<div class="info">
		<User user={players[0]} />
		<span class="dim">VS</span>
		<User user={players[1]} />
	</div>
</div>