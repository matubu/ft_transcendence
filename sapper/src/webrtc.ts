let pc,
	whenReadyFunc,
	weakPeer = true,
	proposalId = -1

class RCTPeer {
	sock
	map

	constructor(sock) {
		this.sock = sock
		this.map = {}
		sock.onmessage = e => {
			let idx = e.data.indexOf(':')
			if (idx === -1) return ;
			const channel = e.data.slice(0, idx)
			const data = JSON.parse(e.data.slice(idx + 1))
			this.map[channel]?.(data)
		}
	}
	send(channel, data = '') { this.sock.send(`${channel}:${JSON.stringify(data)}`) }
	on(channel, callback) { this.map[channel] = callback }
}

let createPeerConnection = (send, id) => {
	pc?.close?.()

	const urls = ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']

	pc = new RTCPeerConnection({ iceServers: [ { urls }, ] })

	pc.onicecandidate = ({ candidate }) => candidate && send({ step: 'candidate', candidate, id })

	pc.ondatachannel = e => {
		proposalId = -1
		whenReadyFunc(new RCTPeer(e.channel))
	}
}

let autoRetry = (send, id) => {
	setTimeout(() => {
		if (proposalId !== id) return ;
		console.log('retrying RTC connection')
		proposalId = -1;
		sendOffer(send, weakPeer)
	}, 1000)
}

export const RTCConnection = (send: Function): Function => {
	return ({ step, ...data }) => {
		const handlers = {
			candidate: ({ candidate, id }) => {
				if (id !== proposalId) return ;
				pc.addIceCandidate(new RTCIceCandidate(candidate))
			},
			offer: async ({ offer, id }) => {
				if (!weakPeer && proposalId !== -1)
					return ;
				proposalId = id
				createPeerConnection(send, proposalId)

				await pc.setRemoteDescription(new RTCSessionDescription(offer))
				pc.createAnswer().then(async answer => {
					await pc.setLocalDescription(answer);
					send({ step: 'answer', answer, id })
				}, err => console.log('error', err))

				autoRetry(send, id)
			},
			answer: ({ answer, id }) => {
				if (id !== proposalId) return ;
				pc.setRemoteDescription(new RTCSessionDescription(answer))
			}
		}

		console.log(`[${data.id}] ${step}`)
		handlers[step]?.(data)
	}
}

export const sendOffer = (send: Function, weak: boolean) => {
	console.log('sendOffer', weak ? 'weak' : 'strong')
	weakPeer = weak
	if (weakPeer && proposalId !== -1)
		return ;
	console.log('createPeerConnection')
	let id = Math.random()
	proposalId = id
	createPeerConnection(send, id)

	const channel = pc.createDataChannel('channel')

	channel.onopen = _ => {
		proposalId = -1
		whenReadyFunc(new RCTPeer(channel))
	}

	pc.createOffer().then(offer => {
		console.log('createOffer')
		pc.setLocalDescription(offer)
		const { sdp, type } = offer
		send({ step: 'offer', offer: { sdp, type }, id })
	}, err => console.log('error', err))

	autoRetry(send, id)
}

export const whenReady = callback => (whenReadyFunc = callback)

export const destroyRTC = () => {
	whenReadyFunc = undefined
	pc?.close?.()
}