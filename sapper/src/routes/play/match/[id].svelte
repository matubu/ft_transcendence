<script>
	import Layout from '@components/Layout.svelte'
	import { send } from '@lib/utils'
	import { RTCConnection, sendOffer, whenReady, destroyRTC } from '@lib/webrtc'
	import { onDestroy, onMount } from 'svelte'

	let id,
		status,
		RTCCallback,
		weakPeer = true,
		RTCSock

	let arena

	// 300 * 200
	const WIDTH = 300
	const HEIGHT = 200

	const BALL_SPEED = 60

	const BALL_SIZE = 5
	const BALL_RADIUS = BALL_SIZE / 2
	const PADDLE_WIDTH = 5
	const PADDLE_HEIGHT = 25

	const PADDLE_H_MARGIN = 10
	const PADDLE_V_MARGIN = PADDLE_HEIGHT / 2 + 5

	let paddleLeft = PADDLE_HEIGHT
	let paddleRight = PADDLE_HEIGHT

	let ballPosition = [WIDTH / 2, HEIGHT / 2]
	let ballVelocity = [0, 0]

	const sendRTC = (channel, data) => RTCSock?.send?.(channel, data)
	const sendProxy = data => send('proxy', [id, data])

	let randomVelocity = () => {
		const x = (Math.random() * .5 + .5) * (Math.random() < .5 ? -1 : 1),
			y = Math.sqrt(1 - x * x) * (Math.random() < .5 ? -1 : 1)
		return ([x, y])
	}
	let sign = (n, sign) => Math.abs(n) * (sign ? -1 : 1)
	let resetBall = () => {
		if (weakPeer) return ;
		ballPosition = [WIDTH / 2, HEIGHT / 2]
		ballVelocity = randomVelocity()
		sendRTC('R', ballVelocity)
	}

	export const lineLine = ([afx, afy], [atx, aty], [bfx, bfy], [btx, bty]): number => {
		let uA = ((atx-afx)*(bfy-afy) - (aty-afy)*(bfx-afx)) / ((aty-afy)*(btx-bfx) - (atx-afx)*(bty-bfy));
		let uB = ((btx-bfx)*(bfy-afy) - (bty-bfy)*(bfx-afx)) / ((aty-afy)*(btx-bfx) - (atx-afx)*(bty-bfy));
		if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1)
			return (uA);
		return (Infinity)
	}
	export const lineRect = ([x, y, w, h], f, t):
		[
			boolean, // vertical intersection
			number // distance (ratio) or infinity
		] =>
		[
			[true, lineLine([x, y], [x, y + h], f, t)],
			[false, lineLine([x, y + h], [x + w, y + h], f, t)],
			[true, lineLine([x + w, y + h], [x + w, y], f, t)],
			[false, lineLine([x + w, y], [x, y], f, t)]
		].reduce(
			(min, curr) => curr[1] < min[1] ? curr[1] : min[1],
			[false, Infinity]
		)

	onMount(() => {
		id = location.pathname.split('/')[3]

		RTCCallback = RTCConnection(sendProxy)

		send('matchData', id)

		whenReady(sock => {
			console.log('!!! RTC CONNECTION READY !!!')
			RTCSock = sock
			// --- PADDLE UPDATE ---
			sock.on('P', pos => paddleRight = pos)
			// --- RESET BALL ---
			sock.on('R', ([vx, vy]) => {
				ballPosition = [WIDTH / 2, HEIGHT / 2]
				ballVelocity = [-vx, vy]
			})
			// --- SYNC BALL ---
			sock.on('S', ([x, y], [vx, vy]) => {
				ballPosition = [WIDTH - x, y]
				ballVelocity = [-vx, vy]
			})
			sendRTC('P', paddleLeft)

			resetBall()
		})

		let previousTimestamp
		requestAnimationFrame(function sim(timestamp) {
			requestAnimationFrame(sim)
			// --- COMPUTE DELTATIME ---
			previousTimestamp ??= timestamp
			let deltaTime = (timestamp - previousTimestamp) / 1000
			// --- UPDATE POSITION
			let lastPosition = [...ballPosition]
			ballPosition[0] += ballVelocity[0] * deltaTime * BALL_SPEED
			ballPosition[1] += ballVelocity[1] * deltaTime * BALL_SPEED
			// --- FRAME VERTICAL COLLISION ---
			if (ballPosition[0] < BALL_RADIUS || ballPosition[0] > WIDTH - BALL_RADIUS)
				resetBall()
			// --- FRAME HORIZONTAL COLLISION ---
			if (ballPosition[1] < BALL_RADIUS || ballPosition[1] > HEIGHT - BALL_RADIUS)
				ballVelocity[1] = sign(ballVelocity[1], ballPosition[1] > HEIGHT - BALL_RADIUS)
			// --- PADDLE COLLISION
			for (let [paddleX, paddleY] of [])
			{
				let [vertical, distance] = lineRect(
					paddleX, paddleY,
					PADDLE_WIDTH, PADDLE_HEIGHT,
					lastPosition,
					ballPosition
				)
				if (distance === Infinity) continue ;
				// --- UPDATE POSITION ---
				// --- CHANGE VELOCITY ---
				ballVelocity[+vertical] *= 1.05
				ballVelocity[+!vertical] *= -1.05
				// --- SYNC BALL ---
				sendRTC('S', [ballPosition, ballVelocity])
			}
			// --- RESET TIMESTAMP
			previousTimestamp = timestamp
		})
	})
	onDestroy(destroyRTC)
</script>

<svelte:window
	on:wsmsg={e => {
		const { channel, data } = e.detail

		const handlers = {
			matchData: ({ weak }) => {
				status = 'game'
				weakPeer = weak
				sendOffer(sendProxy, weak)
			},
			rankedExpired: () => status = 'expired',
			proxy: RTCCallback
		}

		handlers[channel]?.(data)
	}}
	on:mousemove={e => {
		if (!arena) return ;
		let rect = arena.getBoundingClientRect()
		paddleLeft = Math.max(Math.min(
			(e.clientY - rect.top) / rect.height * 200,
			200 - PADDLE_V_MARGIN),
			PADDLE_V_MARGIN
		)
		sendRTC('P', paddleLeft)
	}}
/>

<style>
	.container {
		display: grid;
		place-items: center
	}
	.arena {
		border: 1px solid var(--bord);
		box-sizing: border-box;
		position: relative;
		user-select: none;
		background: black;
		width: min(100%, calc((100vh - 140px - 4rem) * 3 / 2));
		aspect-ratio: 3 / 2;
		overflow: hidden;
		border-radius: 5px;
	}
	.ball, .paddle {
		position: absolute;
		background: white;
		transform: translate(-50%, -50%);
	}
	.ball, .right {
		transition: 0.02s ease;
	}
</style>

<Layout>
	{#if status === 'game'}
		<div class="container">
			<div class="arena" bind:this={arena}>
				<div class="paddle left" style="
					height: {PADDLE_HEIGHT / 2}%;
					width: {PADDLE_WIDTH / 3}%;
					left: {PADDLE_H_MARGIN / 3}%;
					top: {paddleLeft / 2}%;
				"></div>
				<div class="paddle right" style="
					height: {PADDLE_HEIGHT / 2}%;
					width: {PADDLE_WIDTH / 3}%;
					right: {PADDLE_H_MARGIN / 3}%;
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
	{:else if status === 'expired'}
		<h1>Match expired</h1>
	{:else}
		<h1>Loading ...</h1>
	{/if}
</Layout>