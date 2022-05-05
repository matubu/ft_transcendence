<script>
	import { onMount, onDestroy } from "svelte"
	import Game from '@components/Game.svelte'

	let game
	let frame

	onMount(() => {
		game.loadGame([0, 0], {
			nickname: 'Terminator',
			picture: {
				url: 'https://intelligence-artificielle.com/wp-content/uploads/2022/03/Terminator-3.jpg'
			}
		})

		frame = requestAnimationFrame(function bot() {
			game.updatePaddleAbsolute(1, game.getBallPos()[1])
			frame = requestAnimationFrame(bot)
		})

		game.resetBall()
	})

	onDestroy(() => cancelAnimationFrame(frame))
</script>

<svelte:window
	on:touchmove={e => game.updatePaddleRelative(0, e.touches[0].clientY)}
	on:mousemove={e => game.updatePaddleRelative(0, e.clientY)}
/>

<Game bind:this={game}
	syncScore={(score) => {
		if (score[0] >= 11 || score[1] >= 11)
			game.setWinner(score[0] >= 11)
	}}
/>