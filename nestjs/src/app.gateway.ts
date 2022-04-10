import * as WebSocket from 'ws'
import {
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer
} from '@nestjs/websockets'
import { Server } from 'ws'

const puts = (color: number, ...args) =>
	console.log(`\u001B[1;${color}m`, ...args, '\u001B[0m')

@WebSocketGateway(3001)
export class AppGateway {
	userMap: Map<number, Set<any>> = new Map()
	matchingMap: Map<number, any> = new Map()
	matchMap: Map<string, any[]> = new Map()

	@WebSocketServer()
	server: Server

	send(client: any, channel: string, data: any = '') {
		const str = JSON.stringify(data)
		puts(94, `<<< SEND {${client.userId}} ${str} in ${channel}`)
		client.send?.(`${channel}:${str}`)
	}

	sendTo(userId: number, channel: string, data: any = '') {
		const str = JSON.stringify(data)
		puts(94, `<<< SEND {${userId}} ${str} in ${channel}`)
		for (const client of (this.userMap.get(userId) ?? []))
			client.send?.(`${channel}:${str}`)
	}

	handleConnection(client: any) {
		puts(92, `+++ CONNECTED {${client.userId}}`)

		if (!this.userMap.has(client.userId))
			this.userMap.set(client.userId, new Set())
		this.userMap.get(client.userId).add(client)
	}

	handleDisconnect(client: any) {
		puts(91, `--- DISCONNECTED {${client.userId}}`)

		// --- LEAVE MATCHING ROOM ---
		this.leaveRanked(client)
		// --- DISCONNECT FROM MATCH MATCH ---
		this.disconnectFromMatch(client)
		// --- DELETE USER SOCKET ---
		this.userMap.get(client.userId).delete(client)
		if (this.userMap.get(client.userId).size === 0)
			this.userMap.delete(client.userId)
	}

	updateClientStateMatch(client: any, callback: Function) {
		for (const [id, [user1, user2]] of this.matchMap)
		{
			if (client.userId === user1.userId)
			{
				this.matchMap.set(id, [callback(id, user1), user2])
				return (true)
			}
			if (client.userId === user2.userId)
			{
				this.matchMap.set(id, [user1, callback(id, user2)])
				return (true)
			}
		}
		return (false)
	}

	connectToMatch(client: any, informClient: boolean = true) {
		return (this.updateClientStateMatch(client,
			(id, user) => {
				if (user === client || user.readyState === WebSocket.CLOSED)
				{
					informClient && this.send(client, 'matchfound', { id })
					return (client)
				}
				return (user)
			})
		)
	}

	@SubscribeMessage('play')
	onPlay(client: any) {
		this.connectToMatch(client)
	}

	@SubscribeMessage('disconnectMatch')
	disconnectFromMatch(client: any) {
		return (this.updateClientStateMatch(client,
			(id, user) => {
				if (user === client)
					return ({ userId: client.userId, readyState: WebSocket.CLOSED })
				return (user)
			})
		)
	}

	@SubscribeMessage('joinRanked')
	joinRanked(client: any) {
		// --- TRY TO RECONNECT TO OLD MATCH ---
		if (this.connectToMatch(client))
			return ;
		// ---- ADD TO MATCHING LIST ----
		this.matchingMap.set(client.userId, client)
		console.log(this.matchingMap.keys(), this.matchingMap.size)
		if (this.matchingMap.size >= 2)
		{
			// ---- CREATE MATCH ----
			const [[id1, user1], [id2, user2]] = this.matchingMap
			const id = Math.random().toFixed(16).split('.')[1]
			this.matchingMap.delete(id1)
			this.matchingMap.delete(id2)
			this.matchMap.set(id, [user1, user2])
			this.send(user1, 'matchfound', { id })
			this.send(user2, 'matchfound', { id })
		}
	}

	@SubscribeMessage('leaveRanked')
	leaveRanked(client: any) {
		if (this.matchingMap.get(client.userId) === client)
			this.matchingMap.delete(client.userId)
	}

	@SubscribeMessage('matchData')
	onMatchData(client: any, gameId: string) {
		if (!this.matchMap.has(gameId) || this.connectToMatch(client, false) === false)
			return this.send(client, 'rankedExpired')
		const match = this.matchMap.get(gameId)
		this.send(client, 'matchData', { opponent: match[+(client === match[1])].userId, weak: client === match[0] })
	}

	@SubscribeMessage('proxy')
	onProxy(client: any, [gameId, msg]) {
		if (client === this.matchMap.get(gameId)[0])
			this.send(this.matchMap.get(gameId)[1], 'proxy', msg)
		if (client === this.matchMap.get(gameId)[1])
			this.send(this.matchMap.get(gameId)[0], 'proxy', msg)
	}

	@SubscribeMessage('chat')
	onChat(client: any, data: any) {
		// get all user in chat
		// broadcast client and message to them
		// insert new message in db
		this.sendTo(client.userId, 'chat', data);
	}
}
