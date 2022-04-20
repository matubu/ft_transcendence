<svelte:window
	on:wsmsg={e => {
		const { channel, data } = e.detail

		const handlers = {
			matchData: ({ w: weak, s: gameScore, o: opponentData }) => {
				weakPeer = weak
				score = gameScore
				opponent = opponentData
				status = 'game'
				sendOffer(sendProxy, weak)
			},
			matchScore: (gameScore) => {
				score = gameScore
			},
			winner: ([win, gameScore, elo]) => {
				winner = win
				score = gameScore
				eloDiff = elo
			},
			rankedExpired: () => status = 'expired',
			proxy: RTCCallback
		}

		handlers[channel]?.(data)
	}}
	on:touchmove={e => updatePaddle(e.touches[0].clientY)}
	on:mousemove={e => updatePaddle(e.clientY)}
	on:visibilitychange={() => !document.hidden && send('matchScore', [])}
/>

<script>
	import { goto } from '@sapper/app'
	import User from '@components/User.svelte'
	import Head from '@components/Head.svelte'
	import Layout from '@components/Layout.svelte'
	import Guard from '@components/Guard.svelte'
	import Button from '@components/Button.svelte'
	import { send } from '@lib/utils'
	import { RTCConnection, sendOffer, whenReady, destroyRTC } from '@lib/webrtc'
	import { user } from '@lib/store'
	import { onDestroy, onMount } from 'svelte'
	import IconButton from '@components/IconButton.svelte'

	// TODO modal wrong input error message
	// TODO pong duel
	// TODO improve sound
	// TODO fix desync score
	// TODO watch
	// TODO reduce lag
	// TODO add chat side navbar
	// TODO change favicon notification
	// TODO improve winner screen
	// TODO animation battle
	// TODO fix bug score home
	// TODO quit save db winner
	// TODO personalize game

	let id: string,
		status: string,
		RTCCallback: Function,
		weakPeer = true,
		RTCSock,
		opponent

	let mp3
	let playCollisionSound = (type) => {
		mp3[type - 1]?.play?.()
			?.catch?.(() => console.log('cannot play sound'))
	}

	let arena
	let fullscreenArena
	let frame

	// 300 * 200
	const WIDTH: number = 300
	const HEIGHT: number = 200

	const BALL_SPEED: number = 100

	const BALL_SIZE: number = 5
	const BALL_RADIUS: number = BALL_SIZE / 2
	const PADDLE_WIDTH: number = 5
	const PADDLE_HEIGHT: number = 25

	const PADDLE_X_MARGIN: number = 10
	const PADDLE_Y_MARGIN: number = PADDLE_HEIGHT / 2 + 5

	let score: number[] = [0, 0]
	let winner: boolean
	let eloDiff: string

	let paddleLeft: number = HEIGHT / 2
	let paddleRight: number = HEIGHT / 2

	let ballPosition: number[] = [WIDTH / 2, HEIGHT / 2]
	let ballVelocity: number[] = [0, 0]

	const sendRTC = (channel, data) => RTCSock?.sock?.readyState !== 'closed' && RTCSock?.send?.(channel, data)
	const sendProxy = data => send('proxy', [id, data])

	let randomVelocity = () => {
		const x = (Math.random() * .5 + .5) * (Math.random() < .5 ? -1 : 1),
			y = Math.sqrt(1 - x * x) * (Math.random() < .5 ? -1 : 1)
		
		return ([x, y])
	}
	let sign = (n, sign) => Math.abs(n) * (sign ? -1 : 1)
	let resetBall = () => {
		ballPosition = [WIDTH / 2, HEIGHT / 2]
		ballVelocity = randomVelocity()
		!weakPeer && sendRTC('R', ballVelocity)
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
		id = location.pathname.split('/')[3]

		RTCCallback = RTCConnection(sendProxy)

		whenReady(sock => {
			console.log('!!! RTC CONNECTION READY !!!')
			RTCSock = sock
			// --- PADDLE UPDATE ---
			sock.on('P', pos => paddleRight = pos)
			// --- RESET BALL ---
			sock.on('R', ([vx, vy]) => {
				ballPosition = [WIDTH / 2, HEIGHT / 2]
				ballVelocity = [-vx, vy]
				// --- GET SCORE ---
				send('matchScore', [])
			})
			// --- SYNC BALL ---
			sock.on('S', ([[x, y], [vx, vy], collision]) => {
				ballPosition = [WIDTH - x, y]
				ballVelocity = [-vx, vy]
				if (collision)
					playCollisionSound(collision)
			})
			// --- ASKING SYNC ---
			sendRTC('P', paddleLeft)

			resetBall()
		})

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
			let lastPosition = [...ballPosition]
			ballPosition[0] += ballVelocity[0] * deltaTime * BALL_SPEED
			ballPosition[1] += ballVelocity[1] * deltaTime * BALL_SPEED
			// --- FRAME VERTICAL COLLISION ---
			if (ballPosition[0] < BALL_RADIUS || ballPosition[0] > WIDTH - BALL_RADIUS)
			{
				score[+(ballPosition[0] < BALL_RADIUS)]++
				resetBall()
				// --- SYNC SCORE ---
				send('matchScore', score)
				collision = 3
			}
			// --- FRAME HORIZONTAL COLLISION ---
			if (ballPosition[1] < BALL_RADIUS || ballPosition[1] > HEIGHT - BALL_RADIUS)
			{
				ballVelocity[1] = sign(ballVelocity[1], ballPosition[1] > HEIGHT - BALL_RADIUS)
				// --- SOUND ---
				collision = 1
			}
			// --- PADDLE COLLISION
			for (let [paddleX, paddleY] of [[PADDLE_X_MARGIN, paddleLeft], [WIDTH - PADDLE_X_MARGIN, paddleRight]])
			{
				let distance = lineRect(
					[
						paddleX - PADDLE_WIDTH / 2 - BALL_RADIUS, paddleY - PADDLE_HEIGHT / 2 - BALL_RADIUS,
						PADDLE_WIDTH + BALL_SIZE, PADDLE_HEIGHT + BALL_SIZE
					],
					lastPosition,
					ballPosition
				)
				if (distance === Infinity) continue ;
				const SIDE = ballPosition[0] < WIDTH / 2
				// --- CHANGE VELOCITY ---
				ballVelocity[0] = sign(ballVelocity[0] * 1.05, !SIDE)
				ballVelocity[1] *= 1.05
				// --- UPDATE POSITION ---
				const X = PADDLE_X_MARGIN + PADDLE_WIDTH + BALL_SIZE + 1
				ballPosition[0] = SIDE ? X : WIDTH - X
				// --- SYNC BALL ---
				sync = true
				// --- SOUND ---
				collision = 2
			}
			if (sync)
			{
				sendRTC('S', [ballPosition, ballVelocity, collision])
				syncTimestamp = timestamp
			}
			if (collision)
				playCollisionSound(collision)
		})

		send('matchData', id)
	})
	onDestroy(() => {
		destroyRTC()
		typeof document !== 'undefined' && cancelAnimationFrame(frame)
	})

	function updatePaddle(y) {
		if (!arena) return ;
		let rect = arena.getBoundingClientRect()
		paddleLeft = Math.max(Math.min(
			(y - rect.top) / rect.height * 200,
			200 - PADDLE_Y_MARGIN),
			PADDLE_Y_MARGIN
		)
		sendRTC('P', paddleLeft)
	}
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

{#if winner !== undefined}
	<Head title="{winner ? 'You' : opponent?.nickname ?? opponent?.fullname?.split?.(' ')?.[0]} won !" />

	<Guard>
		<header>
			<IconButton alt="surrender" on:click={() => {
				send('surrenderMatch')
				goto('/play/')
			}}>
				<svg height="35" width="35" viewBox="0 0 24 24" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
			</IconButton>
		</header>

		<div class="win-container">
			<div>
				<a href="/user/{winner ? $user.id : opponent.id}">
					<User size="200" user={winner ? $user : opponent} />
				</a>
				<h1>{winner ? 'You' : opponent?.nickname ?? opponent?.fullname.split(' ')[0]} won !</h1>
				<div class="{winner ? 'winning' : 'losing'}">{eloDiff}</div>
			</div>
		</div>
	</Guard>
{:else if status === 'game'}
	<Head title="Match" />

	<Guard>
		<header>
			<IconButton alt="surrender" on:click={() => {
				send('surrenderMatch')
				goto('/play/')
			}}>
				<svg height="35" width="35" viewBox="0 0 24 24" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
			</IconButton>
		</header>

		<div class="vflex container">
			<div class="arena-container" on:click={() => fullscreenArena.requestFullscreen()} bind:this={fullscreenArena}>
				<div class="arena" bind:this={arena}>
					<h2 class="score">
						<span class="{score[0] == score[1] ? 'equal' : (score[0] > score[1] ? 'winning' : 'losing')}">
							{score[0]}
						</span>
						-
						<span class="{score[0] == score[1] ? 'equal' : (score[1] > score[0] ? 'winning' : 'losing')}">
							{score[1]}
						</span>
					</h2>
					<div class="paddle left" style="
						height: {PADDLE_HEIGHT / 2}%;
						width: {PADDLE_WIDTH / 3}%;
						left: {PADDLE_X_MARGIN / 3}%;
						top: {paddleLeft / 2}%;
					"></div>
					<div class="paddle right" style="
						height: {PADDLE_HEIGHT / 2}%;
						width: {PADDLE_WIDTH / 3}%;
						left: {(WIDTH - PADDLE_X_MARGIN) / 3}%;
						top: {paddleRight / 2}%;
					"></div>
					<div class="ball" style="
						height: {BALL_SIZE / 2}%;
						width: {BALL_SIZE / 3}%;
						left: {ballPosition[0] / 3}%;
						top: {ballPosition[1] / 2}%;
					"></div>
				</div>
			</div>

			<div class="vs">
				<a href="/user/{$user.id}">
					<User user={$user} />
				</a>
				<span>VS</span>
				<a href="/user/{opponent.id}">
					<User user={opponent} />
				</a>
			</div>
		</div>
	</Guard>
{:else if status === 'expired'}
	<Head title="Match expired" />

	<Layout>
		<h1>Match expired</h1>
		<div>
			<Button primary href="/play/ranked">Replay</Button>
		</div>
	</Layout>
{:else}
	<Head title="Loading match ..." />

	<Layout>
		<h1>Loading ...</h1>
	</Layout>
{/if}
