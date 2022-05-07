<svelte:window
	on:wsmsg={e => {
		const { channel, data } = e.detail

		const handlers = {
			matchData: ({ w: weak, s: score, o: opponent }) => {
				weakPeer = weak
				sendOffer(sendProxy, weak)
				game.loadGame(score, [
					{
						...get(user),
						nickname: 'You'
					},
					opponent
				])
			},
			matchScore: (score) => game.updateScore(score),
			winner: ([won, score, eloWon]) => game.setWinner(!won, score, eloWon),
			rankedExpired: () => game.setExpired(),
			proxy: RTCCallback
		}

		handlers[channel]?.(data)
	}}
	on:touchmove={e => updatePaddle(e.touches[0].clientY)}
	on:mousemove={e => updatePaddle(e.clientY)}
	on:visibilitychange={() => !document.hidden && send('matchScore', [])}
/>

<script>
	import Game from '@components/Game.svelte'
	import { send } from '@lib/utils'
	import { RTCConnection, sendOffer, whenReady, destroyRTC } from '@lib/webrtc'
	import { onDestroy, onMount } from 'svelte'
	import { get } from 'svelte/store'
	import { user } from '@lib/store'

	let game

	let id: string,
		RTCCallback: Function,
		weakPeer = true,
		RTCSock

	const sendRTC = (channel, data) => RTCSock?.sock?.readyState !== 'closed' && RTCSock?.send?.(channel, data)
	const sendProxy = data => send('proxy', [id, data])

	onMount(() => {
		id = location.pathname.split('/')[3]

		RTCCallback = RTCConnection(sendProxy)

		game.onGameLoop(dt => game.handleKeyboardInput(0, dt))

		whenReady(sock => {
			console.log('!!! RTC CONNECTION READY !!!')
			RTCSock = sock
			// --- PADDLE UPDATE ---
			sock.on('P', pos => game.updatePaddleRelative(1, pos))
			// --- SYNC BALL ---
			sock.on('S', ([[x, y], [vx, vy], collisionId]) => {
				game.updateBall([game.WIDTH - x, y], [-vx, vy], collisionId)
				// --- ASKING SCORE SYNC ---
				collisionId === game.DAMAGE_SOUND && send('matchScore', [])
			})

			sendRTC('P', game.getPaddle(0))

			if (!weakPeer) {
				game.resetBall()
				syncBall()
			}
		})

		send('matchData', id)
	})
	onDestroy(destroyRTC)

	function updatePaddle(y) {
		sendRTC('P', y)
		game.updatePaddleRelative(0, y)
	}

	function syncBall(collisionId = 0) {
		if (collisionId !== Game.DAMAGE_SOUND || !weakPeer)
			sendRTC('S', [game.getBallPos(), game.getBallVel(), collisionId])
	}
</script>

<Game bind:this={game}
	syncSurrender={() => send('surrenderMatch')}
	{syncBall}
	syncScore={(score) => send('matchScore', score)}
/>