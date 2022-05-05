<script>
	import User from '@components/User.svelte'
	import Head from '@components/Head.svelte'
	import Layout from '@components/Layout.svelte'
	import Guard from '@components/Guard.svelte'
	import Button from '@components/Button.svelte'
	import { user } from '@lib/store'
	import IconButton from '@components/IconButton.svelte'
	import { get } from 'svelte/store'
	import { onMount, onDestroy } from 'svelte'
	import { goto } from '@sapper/app'
	import { fetchUser } from '@lib/utils'

	export const WIDTH: number = 300
	export const HEIGHT: number = 200

	export const BALL_SPEED: number = 100

	export const BALL_SIZE: number = 5
	export const BALL_RADIUS: number = BALL_SIZE / 2
	export const PADDLE_WIDTH: number = 5
	export const PADDLE_HEIGHT: number = 25

	export const PADDLE_X_MARGIN: number = 10
	export const PADDLE_Y_MARGIN: number = PADDLE_HEIGHT / 2 + 5

	let frame

	let expired = false
	let game = undefined

	let arenaContainer: HTMLElement
	let arena: HTMLElement

	let paddles = [HEIGHT / 2, HEIGHT / 2]
	let ballPos: number[] = [WIDTH / 2, HEIGHT / 2]
	let ballVel: number[] = [0, 0]

	let paddlesElm = []
	let ballElm

	export let syncSurrender: Function
	export const updatePaddleRelative = (i, y) => {
		if (!arena) return ;
		let rect = arena.getBoundingClientRect()
		updatePaddleAbsolute(i, (y - rect.top) / rect.height * 200)
	}
	export const updatePaddleAbsolute = (i, y) => {
		paddles[i] = Math.max(Math.min(
			y,
			200 - PADDLE_Y_MARGIN),
			PADDLE_Y_MARGIN
		)
		paddlesElm[i].style.top = `${paddles[i] / 2}%`
	}
	export const getPaddle = (i) => paddles[i]
	export const getBallPos = () => ballPos
	export const getBallVel = () => ballVel
	export let syncBall: Function
	export let syncScore: Function
	let updateDOMBall = () => {
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

	export const loadGame = (score, opponent) => {
		game = {
			score,
			opponent
		}
	}

	export const setWinner = (won, score = game.score, eloWon) => {
		game.won = won
		game.score = score
		game.winner = won ? get(user) : game.opponent
		game.winnerName = game.won ? 'You' : game.opponent.nickname ?? game.opponent.fullname.split(' ')[0]
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
	let sign = (n, sign) => Math.abs(n) * (sign ? -1 : 1)
	export const resetBall = () => {
		ballPos = [WIDTH / 2, HEIGHT / 2]
		ballVel = randomVelocity()
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
	export const lineRect = ([x, y, w, h], f, t): number =>
		Math.min(
			lineLine([x, y], [x, y + h], f, t),
			lineLine([x, y + h], [x + w, y + h], f, t),
			lineLine([x + w, y + h], [x + w, y], f, t),
			lineLine([x + w, y], [x, y], f, t)
		)

	onMount(() => {
		mp3 = [new Audio('ping.mp3'), new Audio('pong.mp3'), new Audio('oof.mp3')]

		let previousTimestamp
		let syncTimestamp
		frame = requestAnimationFrame(function sim(timestamp) {
			syncTimestamp ??= timestamp
			let sync: boolean = (timestamp - syncTimestamp) > 3000;
			let collision = 0
			frame = requestAnimationFrame(sim)
			// --- COMPUTE DELTATIME ---
			previousTimestamp ??= timestamp
			let deltaTime = (timestamp - previousTimestamp) / 1000
			// --- RESET TIMESTAMP ---
			previousTimestamp = timestamp
			// --- CHECK IF GAME ---
			if (!arena)
				return ;
			// --- UPDATE POSITION
			let lastPosition = [...ballPos]
			ballPos[0] += ballVel[0] * deltaTime * BALL_SPEED
			ballPos[1] += ballVel[1] * deltaTime * BALL_SPEED
			// --- FRAME VERTICAL COLLISION ---
			if (ballPos[0] < BALL_RADIUS || ballPos[0] > WIDTH - BALL_RADIUS)
			{
				game.score[+(ballPos[0] < WIDTH / 2)]++
				syncScore?.(game.score)
				resetBall()
				sync = true
				collision = 3
			}
			// --- FRAME HORIZONTAL COLLISION ---
			if (ballPos[1] < BALL_RADIUS || ballPos[1] > HEIGHT - BALL_RADIUS)
			{
				ballVel[1] = sign(ballVel[1], ballPos[1] > HEIGHT - BALL_RADIUS)
				// --- SOUND ---
				collision = 1
			}
			// --- PADDLE COLLISION
			for (let [paddleX, paddleY] of [[PADDLE_X_MARGIN, paddles[0]], [WIDTH - PADDLE_X_MARGIN, paddles[1]]])
			{
				let distance = lineRect(
					[
						paddleX - PADDLE_WIDTH / 2 - BALL_RADIUS, paddleY - PADDLE_HEIGHT / 2 - BALL_RADIUS,
						PADDLE_WIDTH + BALL_SIZE, PADDLE_HEIGHT + BALL_SIZE
					],
					lastPosition,
					ballPos
				)
				if (distance === Infinity) continue ;
				const SIDE = ballPos[0] < WIDTH / 2
				// --- CHANGE VELOCITY ---
				ballVel[0] = sign(ballVel[0] * 1.05, !SIDE)
				ballVel[1] *= 1.05
				// --- UPDATE POSITION ---
				const X = PADDLE_X_MARGIN + PADDLE_WIDTH + BALL_SIZE + 1
				ballPos[0] = SIDE ? X : WIDTH - X
				// --- SYNC BALL ---
				sync = true
				// --- SOUND ---
				collision = 2
			}
			if (sync)
			{
				syncBall?.(ballPos, ballVel, collision)
				syncTimestamp = timestamp
			}
			if (collision)
				playCollisionSound(collision)
			updateDOMBall()
		})
	})

	typeof document !== 'undefined' && onDestroy(() => cancelAnimationFrame(frame))
</script>

<style>
	.container {
		margin: 0 auto;
	}
	.arena {
		border: 1px solid var(--bord);
		box-sizing: border-box;
		position: relative;
		user-select: none;
		background: var(--fore);
		--width:  min(calc(100vw - 2rem), calc((100vh - 160px - 2rem) / 2 * 3));
		width: var(--width);
		height: calc(var(--width) / 3 * 2);
		overflow: hidden;
		border-radius: 2px;
	}
	.arena-container {
		display: grid;
		place-items: center;
	}
	:fullscreen .arena {
		--width: min(calc(100vw), calc(100vh / 2 * 3));
	}
	.ball, .paddle {
		position: absolute;
		background: white;
		transform: translate(-50%, -50%);
	}
	.ball, .paddle { top: 50% }
	.ball { left: 50% }
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
		text-shadow: 0 0 10px #9ccfdb6b;
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
			<IconButton alt="surrender" on:click={() => {
				goto('/play/')
			}}>
				<svg height="35" width="35" viewBox="0 0 24 24" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
			</IconButton>
		</header>

		<div class="win-container">
			<div>
				<a href="/user/{game.winner.id}">
					<User size="200" user={game.winner} />
				</a>
				<h1>{game.winnerName} won !</h1>
				{#if game.eloWon}
					<div class="{game.won ? 'winning' : 'losing'}">{game.eloWon}</div>
				{/if}
			</div>
		</div>
	</Guard>
{:else}
	<Head title="Match" />

	<Guard>
		<header>
			<IconButton alt="surrender" on:click={() => {
				goto('/play/')
				syncSurrender?.()
			}}>
				<svg height="35" width="35" viewBox="0 0 24 24" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
			</IconButton>
		</header>

		<div class="vflex container">
			<div class="arena-container" on:click={() => arenaContainer.requestFullscreen()} bind:this={arenaContainer}>
				<div class="arena" bind:this={arena}>
					<h2 class="score">
						<span class="{_isWinningClass(game.score[0], game.score[1])}">
							{game.score[0]}
						</span>
						-
						<span class="{_isWinningClass(game.score[1], game.score[0])}">
							{game.score[1]}
						</span>
					</h2>
					<div bind:this={paddlesElm[0]} class="paddle left" style="
						height: {PADDLE_HEIGHT / 2}%;
						width: {PADDLE_WIDTH / 3}%;
						left: {PADDLE_X_MARGIN / 3}%;
					"></div>
					<div bind:this={paddlesElm[1]} class="paddle right" style="
						height: {PADDLE_HEIGHT / 2}%;
						width: {PADDLE_WIDTH / 3}%;
						left: {(WIDTH - PADDLE_X_MARGIN) / 3}%;
					"></div>
					<div bind:this={ballElm} class="ball" style="
						height: {BALL_SIZE / 2}%;
						width: {BALL_SIZE / 3}%;
					"></div>
				</div>
			</div>

			<div class="vs">
				<a href="/user/{$user.id}">
					<User user={$user} />
				</a>
				<span>VS</span>
				<a href="/user/{game.opponent.id}">
					<User user={game.opponent} />
				</a>
			</div>
		</div>
	</Guard>
{/if}
