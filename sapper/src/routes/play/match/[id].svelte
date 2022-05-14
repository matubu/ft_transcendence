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
	on:touchmove={e => game.updatePaddleRelative(0, e.touches[0].clientY)}
	on:mousemove={e => game.updatePaddleRelative(0, e.clientY)}
	on:visibilitychange={() => !document.hidden && send('matchScore', [])}
/>

<script>
	import Game from '@components/Game.svelte'
	import { send } from '@lib/utils'
	import { RTCConnection, sendOffer, whenReady, destroyRTC } from '@lib/webrtc'
	import { onDestroy, onMount } from 'svelte'
	import { get } from 'svelte/store'
	import { user } from '@lib/store'

	import { stores } from '@sapper/app'
	const { page } = stores()

	let game

	let { id } = get(page).params,
		RTCCallback: Function,
		weakPeer = true,
		RTCSock

	const sendRTC = (channel, data) => RTCSock?.sock?.readyState !== 'closed' && RTCSock?.send?.(channel, data)
	const sendProxy = data => send('proxy', [id, data])

	onMount(() => {
		RTCCallback = RTCConnection(sendProxy)

		game.onGameLoop(dt => game.handleKeyboardInput(0, dt))

		whenReady(sock => {
			console.log('!!! RTC CONNECTION READY !!!')
			RTCSock = sock
			// --- PADDLE UPDATE ---
			sock.on('P', pos => game.updatePaddleAbsolute(1, pos))
			// --- SYNC BALL ---
			sock.on('B', ([[x, y], [vx, vy], collisionId]) => {
				console.log(`%c[RECV]%c${new Date().toLocaleTimeString([], {
					hour12: false,
					hour: '2-digit',
					minute: '2-digit',
					fractionalSecondDigits: 3
				})} ${collisionId === game.DAMAGE_SOUND ? 'RESET' : ''}`, 'color: hotpink')
				game.updateBall([game.WIDTH - x, y], [-vx, vy], collisionId)
				// --- ASKING SCORE SYNC ---
				collisionId === game.DAMAGE_SOUND && send('matchScore', [])
			})

			sendGameData('P', game.getPaddle(0))

			if (!weakPeer) {
				game.resetBall()
				syncBall()
			}
		})

		send('matchData', id)
	})
	onDestroy(destroyRTC)

	function sendGameData(type, data) {
		sendRTC(type, data)
		send('GameData', {
			id,
			type,
			data
		})
	}

	function syncBall(collisionId = 0) {
		if (collisionId === game.DAMAGE_SOUND && weakPeer)
			return ;
		console.log(`%c[SEND]%c${new Date().toLocaleTimeString([], {
			hour12: false,
			hour: '2-digit',
			minute: '2-digit',
			fractionalSecondDigits: 3
		})} ${collisionId === game.DAMAGE_SOUND ? 'RESET' : ''}`, 'color: aquamarine')
		sendGameData('B', [game.getBallPos(), game.getBallVel(), collisionId])
	}

	let py
	let timeout
</script>

<Game bind:this={game}
	syncSurrender={() => send('surrenderMatch')}
	{syncBall}
	syncPaddle={(i, y) => {
		if (i !== 0) return ;
		if (Math.abs(py - y) < 10)
		{
			sendRTC('P', y)
			if (timeout) return ;
			timeout = setTimeout(() => {
				py = game.getPaddle(0)
				send('GameData', {
					id,
					type: 'P',
					data: py
				})
				timeout = undefined
			}, 200)
			return ;
		}
		clearTimeout(timeout)
		timeout = undefined
		sendGameData('P', y)
		py = y
	}
	}
	syncScore={(score) => send('matchScore', score)}
/>