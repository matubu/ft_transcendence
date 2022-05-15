<svelte:window
	on:keydown={e => keysPressed.add(e.key.toLowerCase())}
	on:keyup={e => keysPressed.delete(e.key.toLowerCase())}
/>

<script>
	import User from '@components/User.svelte'
	import Head from '@components/Head.svelte'
	import Layout from '@components/Layout.svelte'
	import Guard from '@components/Guard.svelte'
	import Button from '@components/Button.svelte'
	import IconButton from '@components/IconButton.svelte'
	import { onMount, tick } from 'svelte'
	import { goto } from '@sapper/app'

	export const WIDTH: number = 300
	export const HEIGHT: number = 200

	export const BALL_SPEED: number = 80
	export const BALL_ACCELERATION: number = 1.1

	export const PLAYER_SPEED = 80

	export const BALL_SIZE: number = 10
	export const BALL_RADIUS: number = BALL_SIZE / 2
	export const PADDLE_WIDTH: number = 5
	export const PADDLE_HEIGHT: number = 25

	export const PADDLE_X_MARGIN: number = 10
	export const PADDLE_Y_MARGIN: number = PADDLE_HEIGHT / 2 + 5

	let keysPressed = new Set()
	export function handleKeyboardInput(id, deltatime) {
		let speed = 1
		if (keysPressed.has('shift'))
			speed *= 3
		if (keysPressed.has('control'))
			speed /= 3
		if (keysPressed.has('arrowup')
			|| keysPressed.has('w')
			|| keysPressed.has('z')
			|| keysPressed.has('o')
			|| keysPressed.has('i')
			|| keysPressed.has('8')
		)
			updatePaddleAbsolute(id,
				getPaddle(id)
					- PLAYER_SPEED * speed * deltatime
			)
		if (keysPressed.has('arrowdown')
			|| keysPressed.has('s')
			|| keysPressed.has('l')
			|| keysPressed.has('k')
			|| keysPressed.has('j')
			|| keysPressed.has('2')
		)
			updatePaddleAbsolute(id,
				getPaddle(id)
					+ PLAYER_SPEED * speed * deltatime
			)
	}

	let registeredFunctions = []
	export function onGameLoop(callback) {
		registeredFunctions.push(callback)
	}

	let frame

	let expired = false
	let game = undefined

	let arenaContainer: HTMLElement
	let arena: HTMLElement

	let paddles = [HEIGHT / 2, HEIGHT / 2]
	let ballPos: number[] = [WIDTH / 2, HEIGHT / 2]
	let ballVel: number[] = [0, 0]

	let paddlesElm = []

	export let syncSurrender: Function = undefined
	export const updatePaddleRelative = (i, y) => {
		if (!arena) return ;
		let rect = arena.getBoundingClientRect()
		updatePaddleAbsolute(i, (y - rect.top) / rect.height * 200)
	}
	export const updatePaddleAbsolute = (i, y) => {
		paddles[+i] = y = Math.max(Math.min(
			y,
			200 - PADDLE_Y_MARGIN),
			PADDLE_Y_MARGIN
		)
		syncPaddle?.(+i, y)
		if (paddlesElm[+i])
			paddlesElm[+i].style.top = `${y / 2}%`
	}
	export const getPaddle = (i) => paddles[i]
	export const getBallPos = () => ballPos
	export const getBallVel = () => ballVel
	export let syncBall: Function = undefined
	export let syncPaddle: Function = undefined
	export let syncScore: Function = undefined

	let ballElm
	let updateDOMBall = () => {
		if (!ballElm) return ;
		ballElm.style.left = `${ballPos[0] / 3}%`
		ballElm.style.top = `${ballPos[1] / 2}%`
	}

	export const updateBall = (newBallPos, newBallVel, collisionId) => {
		ballPos = newBallPos
		ballVel = newBallVel
		if (collisionId)
			playCollisionSound(collisionId)
		updateDOMBall()
	}
	export const updateScore = (score) => {
		game.score = score
	}

	let mp3
	let playCollisionSound = (type) => {
		mp3[type - 1]
			?.play?.()
			?.catch?.(() => {})
	}

	export const loadGame = (score, players) => {
		game = {
			score,
			players
		}

		/// THEME ///
		const theme = localStorage.getItem('theme') ?? '90'
		if (theme !== '90') (async () => {
			await tick()
			arena.style.background = `no-repeat center/cover url("/theme/${theme}/arena.webp")`
			ballElm.style.background = `no-repeat center/cover url("/theme/${theme}/ball.webp")`
			for (let paddleElm of paddlesElm)
				paddleElm.style.background = `no-repeat center/cover url("/theme/${theme}/paddle.webp")`
		})()
	}

	export const setWinner = (winnerIdx, score = game.score, eloWon) => {
		game.score = score
		game.winner = game.players[+winnerIdx]
		game.winnerName = game.winner.nickname ?? game.winner.fullname.split(' ')[0]
		game.eloWon = eloWon
	}

	export const setExpired = () => {
		expired = true
	}

	let _isWinningClass = (scoreA, scoreB) => scoreA === scoreB ? 'equal' : (scoreA > scoreB ? 'winning' : 'losing')

	let randomVelocity = () => {
		const x = (Math.random() * .5 + .5) * (Math.random() < .5 ? -1 : 1),
			y = Math.sqrt(1 - x * x) * (Math.random() < .5 ? -1 : 1)
		
		return ([x, y])
	}
	let sign = (n, negative) => Math.abs(n) * (negative ? -1 : 1)
	export const resetBall = () => {
		ballPos = [WIDTH / 2, HEIGHT / 2]
		ballVel = randomVelocity()
	}
	export let syncReset = () => {
		syncScore?.(game.score)
		resetBall()
		syncUpdateBall(DAMAGE_SOUND)
	}

	export const lineLine = ([afx, afy], [atx, aty], [bfx, bfy], [btx, bty]): number => {
		let uA = ((atx-afx)*(bfy-afy) - (aty-afy)*(bfx-afx)) / ((aty-afy)*(btx-bfx) - (atx-afx)*(bty-bfy));
		let uB = ((btx-bfx)*(bfy-afy) - (bty-bfy)*(bfx-afx)) / ((aty-afy)*(btx-bfx) - (atx-afx)*(bty-bfy));
		if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1)
			return (uA);
		return (Infinity)
	}
	/**
	 * @returns
	 * - the distance (a ratio) or infinity if no intersection
	*/
	export const lineRect = ([x, y, w, h], f, t): (number|boolean)[] =>
		[
			[lineLine([x, y + h], [x + w, y + h], f, t), false],
			[lineLine([x + w, y + h], [x + w, y], f, t), true],
			[lineLine([x + w, y], [x, y], f, t), false]
		].reduce((a, b) => a[0] < b[0] ? a : b, [Infinity, false])

	export const BALL_WALL_SOUND = 1
	export const BALL_PADDLE_SOUND = 2
	export const DAMAGE_SOUND = 3

	const syncUpdateBall = (collision) => {
		syncBall?.(collision)
		playCollisionSound(collision)
		updateDOMBall()
	}

	onMount(() => {
		mp3 = [new Audio('/audio/90/wall.mp3'), new Audio('/audio/90/paddle.mp3'), new Audio('/audio/90/score.mp3')]

		let previousTimestamp
		let paddlesOld
		frame = requestAnimationFrame(function sim(timestamp) {
			frame = requestAnimationFrame(sim)

			previousTimestamp ??= timestamp

			let deltaTime = (timestamp - previousTimestamp) / 1000

			previousTimestamp = timestamp

			if (!arena) return ;

			for (let callback of registeredFunctions)
				callback(deltaTime)

			paddlesOld ??= [...paddles]
			let paddlesDeltaY = [
				paddlesOld[0] - paddles[0],
				paddlesOld[1] - paddles[1]
			]
			paddlesOld = [...paddles]

			let lastPosition = [...ballPos]
			ballPos[0] += ballVel[0] * deltaTime * BALL_SPEED
			ballPos[1] += ballVel[1] * deltaTime * BALL_SPEED

			/// FRAME VERTICAL COLLISION ///
			if (ballPos[0] < BALL_RADIUS || ballPos[0] > WIDTH - BALL_RADIUS)
			{
				game.score[+(ballPos[0] < WIDTH / 2)]++
				syncReset()
				return ;
			}

			/// FRAME HORIZONTAL COLLISION ///
			if (ballPos[1] < BALL_RADIUS || ballPos[1] > HEIGHT - BALL_RADIUS)
			{
				ballVel[1] = sign(ballVel[1], ballPos[1] > HEIGHT - BALL_RADIUS)
				syncUpdateBall(BALL_WALL_SOUND)
				return ;
			}

			/// PADDLE COLLISION ///
			for (let [paddleX, paddleY, width, paddleDeltaY] of [
				[
					PADDLE_X_MARGIN - PADDLE_WIDTH / 2 - BALL_RADIUS,
					paddles[0],
					PADDLE_WIDTH + BALL_SIZE,
					paddlesDeltaY[0]
				],
				[
					WIDTH - (PADDLE_X_MARGIN - PADDLE_WIDTH / 2 - BALL_RADIUS),
					paddles[1],
					-(PADDLE_WIDTH + BALL_SIZE),
					paddlesDeltaY[1]
				]
			])
			{
				let [distance, vertical] = lineRect(
					[
						paddleX,
						paddleY - PADDLE_HEIGHT / 2 - BALL_RADIUS,
						width,
						PADDLE_HEIGHT + BALL_SIZE
					],
					[
						lastPosition[0],
						lastPosition[1] + paddleDeltaY
					],
					ballPos
				)
				if (distance === Infinity) continue ;
				/// CHANGE VELOCITY ///
				if (vertical) {
					const SIDE = ballPos[0] > WIDTH / 2
					ballVel[0] = sign(ballVel[0] * BALL_ACCELERATION, SIDE)
					ballVel[1] *= BALL_ACCELERATION
					/// UPDATE POSITION ///
					const X = PADDLE_X_MARGIN + PADDLE_WIDTH + BALL_RADIUS + 1
					ballPos[0] = SIDE ? WIDTH - X : X
				} else {
					const SIDE = ballPos[1] < paddleY
					ballVel[1] = sign(ballVel[0] * BALL_ACCELERATION, SIDE)
					ballVel[0] *= BALL_ACCELERATION
					/// UPDATE POSITION ///
					ballPos[1] = paddleY
						+ (PADDLE_HEIGHT / 2 + BALL_RADIUS + 1) * (SIDE ? -1 : 1)
				}
				syncUpdateBall(BALL_PADDLE_SOUND)
				return ;
			}
			updateDOMBall()
		})

		return (() => cancelAnimationFrame(frame))
	})
</script>

<style>
	.container {
		margin: 0 auto;
	}
	.🏟️ {
		border: 1px solid var(--bord);
		box-sizing: border-box;
		position: relative;
		user-select: none;
		background: var(--fore);
		--width: min(calc(100vw - 2rem), calc((100vh - 160px - 2rem) / 2 * 3));
		width: var(--width);
		height: calc(var(--width) / 3 * 2);
		overflow: hidden;
		border-radius: 2px;
	}
	.arena-container {
		display: grid;
		place-items: center;
	}
	:fullscreen .🏟️ {
		--width: min(calc(100vw), calc(100vh / 2 * 3));
	}
	.🎾, .🏓  {
		position: absolute;
		background: white;
		transform: translate3d(-50%, -50%, 0);
		pointer-events: none;
	}
	.🎾, .🏓  { top: 50% }
	.🎾 { left: 50% }
	.score {
		text-align: center;
		font-size: 1em;
	}
	.vs {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 35px;
	}
	.vs span {
		background: linear-gradient(45deg, #00adff, #1646f5);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		text-shadow: 0 0 2px #9ccfdb6b;
		font-weight: 900;
	}
	.win-container {
		flex: 1;
		display: grid;
		place-items: center;
		text-align: center;
		gap: 20px;
	}
	.win-container > div {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.win-container h1 {
		margin-top: 20px;
	}
</style>

{#if expired}
	<Head title="Match expired" />

	<Layout>
		<h1>Match expired</h1>
		<div>
			<Button primary href="/play/ranked">Replay</Button>
		</div>
	</Layout>
{:else if game === undefined}
	<Head title="Loading match ..." />

	<Layout>
		<h1>Loading ...</h1>
	</Layout>
{:else if game.winner}
	<Head title="{game.winnerName} won !" />

	<Guard>
		<header>
			<IconButton alt="Surrender" on:click={() => {
				goto('/play/')
			}}>
				<svg height="35" width="35" viewBox="0 0 24 24" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
			</IconButton>
		</header>

		<div class="win-container">
			<div>
				<a href="/user/{game.winner.id}">
					<User size="200" user={game.winner} nostatus />
				</a>
				<h1>{game.winnerName} won !</h1>
				{#if game.eloWon}
					<div class="{_isWinningClass(game.eloWon, 0)}">{game.eloWon}</div>
				{/if}
			</div>
		</div>
	</Guard>
{:else}
	<Head title="Match" />

	<Guard>
		<header>
			<IconButton alt="Surrender" on:click={() => {
				goto('/play/')
				syncSurrender?.()
			}}>
				<svg height="35" width="35" viewBox="0 0 24 24" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
			</IconButton>
		</header>

		<div class="vflex container">
			<div
				class="arena-container theme-{localStorage.getItem('theme') ?? '90'}"
				on:click={() => arenaContainer.requestFullscreen()}
				bind:this={arenaContainer}
			>
				<div class="🏟️" bind:this={arena}>
					<h2 class="score">
						<span class="{_isWinningClass(game.score[0], game.score[1])}">
							{game.score[0]}
						</span>
						:
						<span class="{_isWinningClass(game.score[1], game.score[0])}">
							{game.score[1]}
						</span>
					</h2>
					<div bind:this={ballElm} class="🎾" style="
						height: {BALL_SIZE / 2}%;
						width: {BALL_SIZE / 3}%;
					"></div>
					<div bind:this={paddlesElm[0]} class="🏓  left" style="
						height: {PADDLE_HEIGHT / 2}%;
						width: {PADDLE_WIDTH / 3}%;
						left: {PADDLE_X_MARGIN / 3}%;
					"></div>
					<div bind:this={paddlesElm[1]} class="🏓  right" style="
						height: {PADDLE_HEIGHT / 2}%;
						width: {PADDLE_WIDTH / 3}%;
						left: {(WIDTH - PADDLE_X_MARGIN) / 3}%;
					"></div>
				</div>
			</div>

			<div class="vs">
				{#if game.players[0].id}
					<a href="/user/{game.players[0].id}">
						<User user={game.players[0]} />
					</a>
				{:else}
					<div>
						<User user={game.players[0]} />
					</div>
				{/if}
				<span>VS</span>
				{#if game.players[1].id}
					<a href="/user/{game.players[1].id}">
						<User user={game.players[1]} />
					</a>
				{:else}
					<div>
						<User user={game.players[1]} />
					</div>
				{/if}
			</div>
		</div>
	</Guard>
{/if}
