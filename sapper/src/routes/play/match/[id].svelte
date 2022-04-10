<script>
	import Layout from '@components/Layout.svelte'
	import { send } from '@lib/utils'
	import { RTCConnection, sendOffer, whenReady, destroyRTC } from '@lib/webrtc'
	import { onDestroy, onMount } from 'svelte'

	let id,
		status,
		RTCCallback,
		weakPeer = true

	const sendProxy = data => send('proxy', [id, data])

	onMount(() => {
		id = location.pathname.split('/')[3]

		RTCCallback = RTCConnection(sendProxy)

		send('matchData', id)

		whenReady(sock => {
			console.log('!!! RTC CONNECTION READY !!!')
			sock.on('PING', () => {
				console.log('PING')
				sock.send('PONG')
			})
			sock.on('PONG', () => {
				console.log('PONG')
				setTimeout(() => sock.send('PING'), 500)
			})
			!weakPeer && sock.send('PING')
		})
	})
	onDestroy(destroyRTC)

	// 300 * 200
	const BALL_SIZE = 5
	const PADDLE_WIDTH = 5
	const PADDLE_HEIGHT = 25

	const PADDLE_MARGIN = 10

	let paddleLeft = PADDLE_HEIGHT
	let paddleRight = PADDLE_HEIGHT

	let ball = [300 / 2, 200 / 2]
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
		aspect-ratio: 3 / 2
	}
	.ball, .paddle {
		position: absolute;
		background: white;
		transform: translate(-50%, -50%)
	}
</style>

<Layout>
	{#if status === 'game'}
		<div class="container">
			<div class="arena">
				<div class="paddle" style="
					height: {PADDLE_HEIGHT / 2}%;
					width: {PADDLE_WIDTH / 3}%;
					left: {PADDLE_MARGIN / 3}%;
					top: {paddleLeft / 2}%;
				"></div>
				<div class="paddle" style="
					height: {PADDLE_HEIGHT / 2}%;
					width: {PADDLE_WIDTH / 3}%;
					right: {PADDLE_MARGIN / 3}%;
					top: {paddleRight / 2}%;
				"></div>
				<div class="ball" style="
					height: {BALL_SIZE / 2}%;
					width: {BALL_SIZE / 3}%;
					left: {ball[0] / 3}%;
					top: {ball[1] / 2}%;
				"></div>
			</div>
		</div>
	{:else if status === 'expired'}
		<h1>Match expired</h1>
	{:else}
		<h1>Loading ...</h1>
	{/if}
</Layout>