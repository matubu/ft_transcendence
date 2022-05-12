<script>
	import { onMount, onDestroy } from "svelte"
	import Game from '@components/Game.svelte'
	import { get } from 'svelte/store'
	import { user } from '@lib/store'

	let game
	let frame

	onMount(() => {
		game.loadGame([0, 0], [
			{
				...get(user),
				nickname: 'You'
			},
			{
				nickname: 'Terminator',
				picture: {
					url: 'https://intelligence-artificielle.com/wp-content/uploads/2022/03/Terminator-3.jpg'
				}
			}
		])
		
		const BOT_SPEED = 80
		let targetY
		let ballVel = []
		function updateBot(deltatime) {
			let diffX = game.WIDTH - game.getBallPos()[0]
			if (ballVel[0] !== game.getBallVel()[0]
				|| ballVel[1] !== game.getBallVel()[1])
			{
				targetY = game.getBallPos()[1]
					+ diffX / game.getBallVel()[0] * game.getBallVel()[1]
					+ (Math.random() - .5) * 5
			}
			if (game.getBallVel()[0] > 0)
				game.updatePaddleAbsolute(1,
					game.getPaddle(1)
					+ Math.max(
						Math.min(
							targetY - game.getPaddle(1),
							+BOT_SPEED * deltatime),
						-BOT_SPEED * deltatime)
				)
			ballVel = [...game.getBallVel()]
		}

		game.onGameLoop(dt => game.handleKeyboardInput(0, dt))
		game.onGameLoop(updateBot)

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
			game.setWinner(score[1] >= 11)
	}}
/>