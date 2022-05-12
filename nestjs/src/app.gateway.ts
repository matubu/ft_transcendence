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
import { NotificationService } from './notification/notification.service'

let g_userService
let g_matchService

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

	eloWon(winnerElo: number, loserElo: number, K: number = 42): number
	{
		const elo_diff = Math.abs(winnerElo - loserElo)
		let proba = 1 / (1 + Math.pow(10, elo_diff / 400))
		if (loserElo > winnerElo)
			proba = 1 - proba
		return Math.round(K * proba)
	}
	async endGame(w)
	{
		let l = this.getOpponent(w)
		let winner = await g_userService.get(w.userId, [])
		let loser = await g_userService.get(l.userId, [])
		const d_elo = this.eloWon(winner.elo, loser.elo)
		winner.elo += d_elo
		loser.elo -= d_elo
		send(w, "winner", [true, this.score, `+${d_elo}`])
		send(l, "winner", [false, this.score, `-${d_elo}`])
		g_userService.updateUser(winner)
		g_userService.updateUser(loser)
		g_matchService.saveMatch(this.players[0].userId, this.players[1].userId, this.score[0], this.score[1])
	}
	updateScore(client: any, gameScore: number[]) {
		if (this.isFinish()) return;
		if (client.userId === this.players[1].userId)
			gameScore.reverse()
		if (gameScore[0] > this.score[0])
			this.score[0] = Math.min(gameScore[0], 11)
		if (gameScore[1] > this.score[1])
			this.score[1] = Math.min(gameScore[1], 11)
		if (this.isFinish())
			this.endGame(this.score[0] > this.score[1] ? this.players[0] : this.players[1])
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
		private readonly messageService: MessageService,
		private readonly notificationService: NotificationService
	) {
		g_userService = this.userService
		g_matchService = this.matchService
	}

	userMap: Map<number, Set<any>> = new Map()
	matchingMap: Map<number, any> = new Map()
	matchMap: Map<string, Match> = new Map()
	listenerMap: Map<number, Set<any>> = new Map()
	duelRequestMap: Map<number, number> = new Map()

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
		let { match } = this.getMatchByClient(client)

		match?.disconnectPlayer?.(client)
	}

	@SubscribeMessage('surrenderMatch')
	surrenderFromMatch(client: any) {
		let { id, match } = this.getMatchByClient(client)

		if (match === undefined) return ;
		match.endGame(match.getOpponent(client))
		this.matchMap.delete(id)
		this.updateStatusListener(match.players[0])
		this.updateStatusListener(match.players[1])
	}

	@SubscribeMessage('GameData')
	onGameData(client: any, { id, type, data }) {
		if (!this.matchMap.has(id) || !this.matchMap.get(id).containsPlayerId(id))
			return ;
	}

	createMatch(player1, player2) {
		const id = Math.random().toFixed(16).split('.')[1]
		this.matchMap.set(id, new Match(player1, player2))
		send(player1, 'matchfound', { id })
		send(player2, 'matchfound', { id })
		this.updateStatusListener(player1.userId)
		this.updateStatusListener(player2.userId)
	}

	findMatch(user, max_diff)
	{
		let eloDiff = (userA, userB) => Math.abs(userA.elo - userB.elo)
		let nearest = null
		for (let e of this.matchingMap.values()) {
			if (!nearest && eloDiff(e, user) <= max_diff) nearest = e;
			if (nearest && eloDiff(e, user) < eloDiff(nearest, e)) nearest = e;
		}
		return nearest
	}

	//TODO 
	//searchMatch(user)
	//{
	//	let max_diff: number = 0
	//	let delta: number = 42
	//	let waiting_time: number = 3;

	//	while (true) {
	//		max_diff += delta
	//		let adv = findMatch(user, max_diff)
	//		if (!adv) {
	//			//block while listening for new potential adv
	//			//after {waiting_time} continue
	//			continue;
	//		}
	//		return adv
	//	}
	//}

	@SubscribeMessage('joinRanked')
	async joinRanked(client: any) {
		// --- TRY TO RECONNECT TO OLD MATCH ---
		if (this.connectToMatch(client) !== false)
			return;
		// ---- ADD TO MATCHING LIST ----
		/*this.matchingMap.set(client.userId, client)
		if (this.matchingMap.size >= 2) {
			// ---- CREATE MATCH ----
			const [[id1, player1], [id2, player2]] = this.matchingMap
			this.matchingMap.delete(id1)
			this.matchingMap.delete(id2)
			this.createMatch(player1, player2)
		}*/
		// ---- FIND BEST OPPONENT ----
		let user = await g_userService.get(client.userId, [])
		client.elo = user.elo
		let opp = this.findMatch(client, 9999999) //temp
		if (!opp) {
			// ---- ADD TO MATCHING QUEUE ----
			//TODO now that the player is in queue he needs to allow more elo diff as time goes on //prototype line 227
			this.matchingMap.set(client.userId, client)
			return;
		}
		this.createMatch(client, opp)
		this.matchingMap.delete(opp.userId)
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
		match.updateScore(client, gameScore)
		if (match.isFinish())
		{
			this.matchMap.delete(id)
			this.updateStatusListener(match.players[0])
			this.updateStatusListener(match.players[1])
		}
		else
			send(client, 'matchScore', match.getScore(client))
	}

	@SubscribeMessage('proxy')
	onProxy(client: any, [gameId, msg]) {
		if (this.matchMap.has(gameId))
			send(this.matchMap.get(gameId).getOpponent(client), 'proxy', msg)
	}

	@SubscribeMessage('chat')
	async onChat(client: any, data: any) {
		const { room, msg } = data;
		const users = await this.channelService.getUsers(room);
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
		if ([...this.matchMap.values()].find((match: Match) => match.containsPlayerId(userId)))
			return ('in-game')
		if (this.userMap.get(userId)?.size)
			return ('online')
		return ('offline')
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
		this.sendTo(receiver.id, "notif", notif);
	}

	@SubscribeMessage('typing')
	async isTyping({ userId }, data: { room: string, typing: boolean })
	{
		const users = await this.channelService.getUsers(data.room);
		const typingUser = await this.userService.get(userId, []);
		console.log(userId)
		for (const user of users)
			if (userId !== user.id)
				this.sendTo(user.id, 'typing',
					{ user: typingUser, isTyping: data.typing, room: data.room });
	}

	@SubscribeMessage('duelRequest')
	async onDuelRequest(client: any, data: any) {
		const oppId = data.oppId
		if (oppId == client.userId) return;
		if (this.duelRequestMap.has(oppId)) return;
		this.duelRequestMap.set(client.userId, oppId)
		
		this.notificationService.insert(oppId, "someone want to show you who's the boss! O_o", client.userId, `duel/${client.userId}`)
	}

	@SubscribeMessage('duelAccept')
	async onDuelAccept(client: any, data: any) {
		const oppId = data.oppId
		if (!this.duelRequestMap.has(oppId)) return;
		if (this.duelRequestMap.get(oppId) != client.userId) return;
		//TODO send him duel error reason...
		if (this.getStatus(oppId) !== "online") return;
		const opp = this.userMap.get(oppId)[0]
		this.createMatch(opp, client)
		this.duelRequestMap.delete(oppId)
	}
}
