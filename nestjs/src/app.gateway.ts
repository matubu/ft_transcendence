import {
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer
} from '@nestjs/websockets'
import { Server } from 'ws'

let puts = (color: number, ...args) =>
	console.log(`\u001B[1;${color}m`, ...args, '\u001B[0m')

@WebSocketGateway(3001)
export class AppGateway {
	userMap: Map<number, any> = new Map()
	@WebSocketServer()
	server: Server

	send(client: any, channel: string, data: any) {
		if (!client) return ;
		puts(94, `<<< SEND {${client.userId}} ${JSON.stringify(data)} in ${channel}`)
		client?.send?.(`${channel}:${JSON.stringify(data)}`)
	}
	sendTo(userId: number, channel: string, data: any) {
		this.send(this.userMap.get(userId), channel, data)
	}

	handleConnection(client: any) {
		puts(92, `+++ CONNECTED {${client.userId}}`)
		if (this.userMap.has(client.userId))
			this.userMap.get(client.userId).close()
		this.userMap.set(client.userId, client)
	}

	handleDisconnect(client: any) {
		puts(91, `--- DISCONNECTED {${client.userId}}`)
		this.userMap.delete(client.userId)
	}

	@SubscribeMessage('events')
	onEvent(client: any, data) {
		this.send(client, 'test', 'data')
		this.sendTo(client.userId, 'channel', { x:156, y:489 })
	}
}
