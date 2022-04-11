import * as WebSocket from 'ws'
import {
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer
} from '@nestjs/websockets'
import { Server } from 'ws'
import { ChannelService } from './channel/channel.service';
import { MessageService } from './message/message.service';

const puts = (color: number, ...args) =>
	console.log(`\u001B[1;${color}m`, ...args, '\u001B[0m')

@WebSocketGateway(3001)
export class AppGateway {
	userMap: Map<number, Set<any>> = new Map()
	matchingMap: Map<number, any> = new Map()
	matchMap: Map<string, any[]> = new Map()

	constructor (private readonly channelService: ChannelService, private messageService: MessageService) {}

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
		this.onLeaveRanked(client)
		// --- FIND CURRENT MATCH ---
		for (const [id, [user1, user2]] of this.matchMap)
		{
			if ((user1.userId === client.userId || user2.userId === client.userId)
				&& user1.readyState === WebSocket.CLOSED
				&& user2.readyState === WebSocket.CLOSED)
				// --- DELETE CURRENT MATCH ---
				this.matchMap.delete(id)
		}
		// --- DELETE USER SOCKET ---
		this.userMap.get(client.userId).delete(client)
		if (this.userMap.get(client.userId).size === 0)
			this.userMap.delete(client.userId)
	}

	@SubscribeMessage('play')
	onReconnect(client: any) {
		for (const [id, [user1, user2]] of this.matchMap)
		{
			if (user1.userId === client.userId)
			{
				if (user1 === client || user1.readyState === WebSocket.CLOSED)
				{
					this.matchMap.set(id, [client, user2])
					this.send(client, 'matchfound', { id, opponent: user2.userId })
				}
				return (true);
			}
			if (user2.userId === client.userId)
			{
				if (user2 === client || user2.readyState === WebSocket.CLOSED)
				{
					this.matchMap.set(id, [user1, client])
					this.send(client, 'matchfound', { id, opponent: user1.userId })
				}
				return (true);
			}
		}
	}

	@SubscribeMessage('joinRanked')
	onJoinRanked(client: any) {
		// --- TRY TO RECONNECT TO OLD MATCH ---
		if (this.onReconnect(client) === true)
			return
		// ---- ADD TO MATCHING LIST ----
		this.matchingMap.set(client.userId, client)
		if (this.matchingMap.size >= 2)
		{
			// ---- CREATE MATCH ----
			const [[id1, user1], [id2, user2]] = this.matchingMap
			const id = Math.random().toFixed(16).split('.')[1]
			this.matchingMap.delete(id1)
			this.matchingMap.delete(id2)
			this.matchMap.set(id, [user1, user2])
			this.send(user1, 'matchfound', { id, opponent: id2 })
			this.send(user2, 'matchfound', { id, opponent: id1 })
		}
	}

	@SubscribeMessage('leaveRanked')
	onLeaveRanked(client: any) {
		if (this.matchingMap.get(client.userId) === client)
			this.matchingMap.delete(client.userId)
	}

	@SubscribeMessage('peer2peer')
	onPeer2peer(client: any, [gameId, msg]) {
		if (!this.matchMap.has(gameId))
			return this.send(client, 'rankedExpired')
		if (client === this.matchMap.get(gameId)[0])
			this.send(this.matchMap.get(gameId)[1], 'peer2peer', msg)
		if (client === this.matchMap.get(gameId)[1])
			this.send(this.matchMap.get(gameId)[0], 'peer2peer', msg)
	}

	@SubscribeMessage('chat')
	async onChat(client: any, data: any) {
		//get all user in chat
		//broadcast client and message to them
		//insert new message in db
		const {room, msg} = data;
		const users = await this.channelService.getUsers(room);
		const chatData = {senderId: client.userId, room: room, msg: msg}
		console.log(users)
		for (const user of users)
		{
			this.sendTo(user.id, 'chat', chatData);
		}
		await this.messageService.insert(client.userId, room, msg)
	}
}
