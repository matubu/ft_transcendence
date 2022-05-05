<svelte:window
	on:wsmsg={e => {
		const { channel, data } = e.detail

		const handlers = {
			matchData: ({ w: weak, s: score, o: opponent }) => {
				weakPeer = weak
				sendOffer(sendProxy, weak)
				game.loadGame(score, opponent)
			},
			matchScore: (score) => game.updateScore(score),
			winner: ([won, score, eloWon]) => game.setWinner(won, score, eloWon),
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

		whenReady(sock => {
			console.log('!!! RTC CONNECTION READY !!!')
			RTCSock = sock
			// --- PADDLE UPDATE ---
			sock.on('P', pos => game.updatePaddleRelative(1, pos))
			// --- SYNC BALL ---
			sock.on('S', ([[x, y], [vx, vy], collisionId]) => {
				game.updateBall([game.WIDTH - x, y], [-vx, vy], collisionId)
				// --- ASKING SYNC ---
				collisionId === 3 && send('matchScore', [])
			})
			sendRTC('P', game.getPaddle(0))

			game.resetBall()
		})

		send('matchData', id)
	})
	onDestroy(destroyRTC)

	function updatePaddle(y) {
		sendRTC('P', y)
		game.updatePaddleRelative(0, y)
	}
</script>

<Game bind:this={game}
	syncSurrender={() => send('surrenderMatch')}
	syncBall={(ballPos, ballVel, collisionId) => {
		/*!weakPeer && */sendRTC('S', [ballPos, ballVel, collisionId])
	}}
	syncScore={(score) => send('matchScore', score)}
/>