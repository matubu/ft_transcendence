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

		const SPEED = .05
		let oldTimestamp
		let ballVel = []
		let targetY
		frame = requestAnimationFrame(function bot(timestamp) {
			// COMPLEX BOT
			oldTimestamp ??= timestamp
			let deltatime = timestamp - oldTimestamp
			if (ballVel[0] !== game.getBallVel()[0]
				|| ballVel[1] !== game.getBallVel()[1])
			{
				let diffX = game.WIDTH - game.getBallPos()[0]
				targetY = game.getBallPos()[1]
					+ diffX / game.getBallVel()[0] * game.getBallVel()[1]
					+ Math.random() * 20 - 10
			}
			game.updatePaddleAbsolute(1,
				game.getPaddle(1)
				+ Math.max(
					Math.min(
						targetY - game.getPaddle(1),
						+SPEED * deltatime),
					-SPEED * deltatime)
			)
			ballVel = [...game.getBallVel()]
			oldTimestamp = timestamp

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