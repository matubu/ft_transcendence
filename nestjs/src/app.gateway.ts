import * as WebSocket from 'ws'
import {
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer
} from '@nestjs/websockets'
import { UserService } from 'src/user/user.service'
import { MatchService } from 'src/match/match.service'
import { Server } from 'ws'
import { ChannelService } from './channel/channel.service';
import { MessageService } from './message/message.service';
import { Notification } from 'src/notification/notification.entity'

const puts = (color: number, ...args) =>
	console.log(`\u001B[1;${color}m`, ...args, '\u001B[0m')

const send = (client: any, channel: string, data: any = '') => {
	const str = JSON.stringify(data)
	puts(94, `<<< SEND {${client.userId}} ${str} in ${channel}`)
	client.send?.(`${channel}:${str}`)
}

class Match {
	players: any[]
	watchers: any[] = []
	score: number[] = [0, 0]

	constructor(player1, player2) {
		this.players = [player1, player2]
	}
	containsPlayerId(id) {
		return (id === this.players[0].userId || id === this.players[1].userId)
	}
	containsPlayer(client) {
		return (this.containsPlayerId(client.userId))
	}
	isPlayerWeak(client) {
		return (client.userId === this.players[1].userId)
	}
	getOpponent(client) {
		if (client === this.players[0])
			return (this.players[1])
		if (client === this.players[1])
			return (this.players[0])
	}
	disconnectPlayer(client: any) {
		if (client === this.players[0])
			this.players[0] = { userId: client.userId, readyState: WebSocket.CLOSED }
		if (client === this.players[1])
			this.players[1] = { userId: client.userId, readyState: WebSocket.CLOSED }
	}
	connectPlayer(client: any) {
		if (client.userId === this.players[0].userId) {
			if (this.players[0].readyState === WebSocket.CLOSED)
				this.players[0] = client
			return (true)
		}
		if (client.userId === this.players[1].userId) {
			if (this.players[1].readyState === WebSocket.CLOSED)
				this.players[1] = client
			return (true)
		}
		return (false)
	}
	isFinish() {
		return (this.score[0] >= 11 || this.score[1] >= 11)
	}
	updateScore(client: any, gameScore: number[], finish: Function) {
		if (this.isFinish()) return;
		if (client.userId === this.players[1].userId)
			gameScore.reverse()
		if (gameScore[0] > this.score[0])
			this.score[0] = Math.min(gameScore[0], 11)
		if (gameScore[1] > this.score[1])
			this.score[1] = Math.min(gameScore[1], 11)
		if (this.isFinish()) {
			send(this.players[0], 'matchScore', this.getScore(this.players[0]))
			send(this.players[1], 'matchScore', this.getScore(this.players[1]))
			finish()
		}
		console.log('update score', this.score)
	}
	getScore(client: any) {
		return (client.userId === this.players[0].userId ? this.score : [...this.score].reverse())
	}
}

@WebSocketGateway(3001)
export class AppGateway {
	constructor(
		private readonly userService: UserService,
		private readonly matchService: MatchService,
		private readonly channelService: ChannelService,
		private readonly messageService: MessageService
	) { }

	userMap: Map<number, Set<any>> = new Map()
	matchingMap: Map<number, any> = new Map()
	matchMap: Map<string, Match> = new Map()
	listenerMap: Map<number, Set<any>> = new Map()

	@WebSocketServer()
	server: Server

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
		this.updateStatusListener(client.userId)
	}

	handleDisconnect(client: any) {
		puts(91, `--- DISCONNECTED {${client.userId}}`)

		// --- DELETE LISTENER ---
		for (let [_, set] of this.listenerMap)
			set.delete(client)
		// --- LEAVE MATCHING ROOM ---
		this.leaveRanked(client)
		// --- DISCONNECT FROM MATCH MATCH ---
		this.disconnectFromMatch(client)
		// --- DELETE USER SOCKET ---
		this.userMap.get(client.userId).delete(client)
		if (this.userMap.get(client.userId).size === 0)
			this.userMap.delete(client.userId)
		this.updateStatusListener(client.userId)
	}

	getMatchByClient(client): { id?: string, match?: Match } {
		for (const [id, match] of this.matchMap)
			if (match.containsPlayer(client))
				return ({ id, match })
		return ({})
	}

	connectToMatch(client: any) {
		let { id, match } = this.getMatchByClient(client)

		if (match === undefined) return (false)
		return (match.connectPlayer(client) && id)
	}

	// --- CONNECT TO THE MATCH AND LET THE USER KNOW ---
	@SubscribeMessage('play')
	connectToMatchInform(client: any) {
		let id = this.connectToMatch(client)
		if (id !== false)
			send(client, 'matchfound', { id })
		return (id)
	}

	@SubscribeMessage('disconnectMatch')
	disconnectFromMatch(client: any) {
		let { id, match } = this.getMatchByClient(client)

		match?.disconnectPlayer?.(client)
	}

	@SubscribeMessage('surrenderMatch')
	surrenderFromMatch(client: any) {
		let { id, match } = this.getMatchByClient(client)

		match !== undefined && this.matchMap.delete(id)
	}

	@SubscribeMessage('joinRanked')
	joinRanked(client: any) {
		// --- TRY TO RECONNECT TO OLD MATCH ---
		if (this.connectToMatch(client) !== false)
			return;
		// ---- ADD TO MATCHING LIST ----
		this.matchingMap.set(client.userId, client)
		console.log(this.matchingMap.keys(), this.matchingMap.size)
		if (this.matchingMap.size >= 2) {
			// ---- CREATE MATCH ----
			const [[id1, user1], [id2, user2]] = this.matchingMap
			const id = Math.random().toFixed(16).split('.')[1]
			this.matchingMap.delete(id1)
			this.matchingMap.delete(id2)
			this.matchMap.set(id, new Match(user1, user2))
			send(user1, 'matchfound', { id })
			send(user2, 'matchfound', { id })
			this.updateStatusListener(client.userId)
		}
	}

	@SubscribeMessage('leaveRanked')
	leaveRanked(client: any) {
		if (this.matchingMap.get(client.userId) === client)
			this.matchingMap.delete(client.userId)
	}

	@SubscribeMessage('matchData')
	async onMatchData(client: any, gameId: string) {
		if (!this.matchMap.has(gameId) || this.connectToMatchInform(client) === false)
			return send(client, 'rankedExpired')
		const match = this.matchMap.get(gameId)
		console.log(match.getScore(client))
		send(client, 'matchData', {
			// --- OPPONENT ---
			o: await this.userService.get(match.getOpponent(client)?.userId, []),
			// --- WEAK ---
			w: match.isPlayerWeak(client),
			// --- SCORE ---
			s: match.getScore(client)
		})
	}

	@SubscribeMessage('matchScore')
	onMatchScore(client: any, gameScore: number[]) {
		let { id, match } = this.getMatchByClient(client);

		if (match == undefined) return;
		match?.updateScore?.(client, gameScore, () => {
			console.log('saveMatch')
			this.matchService.saveMatch(match.players[0].userId, match.players[1].userId, match.score[0], match.score[1])
			this.matchMap.delete(id)
		})
		send(client, 'matchScore', match.getScore(client))
	}

	@SubscribeMessage('proxy')
	onProxy(client: any, [gameId, msg]) {
		send(this.matchMap.get(gameId).getOpponent(client), 'proxy', msg)
	}

	@SubscribeMessage('chat')
	async onChat(client: any, data: any) {
		//get all user in chat
		//broadcast client and message to them
		//insert new message in db
		const { room, msg } = data;
		const users = await this.channelService.getUsers(room);
		// const chatData = {senderId: client.userId, room: room, msg: msg}
		const messageInfo = await this.messageService.insert(client.userId, room, msg)
		for (const user of users)
			this.sendTo(user.id, 'chat', { ...messageInfo, room });
	}

	updateStatusListener(userId: number) {
		if (!this.listenerMap.has(userId)) return ;
		let status: string = this.getStatus(userId)
		for (let listener of this.listenerMap.get(userId))
			this.sendStatus(listener, userId, status)
	}

	getStatus(userId: number) {
		if (this.userMap.get(userId)?.size == 0)
			return ('offline')
		if ([...this.matchMap.values()].find((match: Match) => match.containsPlayer(userId)))
			return ('in-game')
		return ('online')
	}

	sendStatus(client: any, userId: number, status = this.getStatus(userId)) {
		send(client, 'userstatus', [userId, status])
	}

	@SubscribeMessage('addStatusListener')
	addStatusListener(client: any, listened: number) {
		this.sendStatus(client, listened)
		if (!this.listenerMap.has(listened))
			this.listenerMap.set(listened, new Set())
		this.listenerMap.get(listened).add(client)
	}

	handleNotifcation(notif: Notification)
	{
		const { receiver } = notif
		if (!receiver) return ;
		// console.log(receiver)
		this.sendTo(receiver.id, "notif", notif);
	}

	@SubscribeMessage('typing')
	async isTyping({ userId }, data: { room: string, typing: boolean })
	{
		const users = await this.channelService.getUsers(data.room);
		const typingUser = await this.userService.get(userId, []);
		for (const user of users)
			// if (userId !== user.id)
				this.sendTo(user.id, 'typing',
				{ user: typingUser, isTyping: data.typing, room: data.room });
	}
}
