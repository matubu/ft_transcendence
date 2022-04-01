import {
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	WsResponse,
} from '@nestjs/websockets'
import { Server } from 'ws'
import { Autorization } from './auth.guard'

let clients: Map<number, any> = new Map()

@WebSocketGateway()
export class AppGateway {
	@WebSocketServer()
	server: Server;

	handleConnection(client, ...args: any[]) {
		// console.log(`=====> Client connected: ${client.id}`, client, args);
		// console.log('=====>>>>>', client, args, '<<<<<=====')
	}

	handleDisconnect(client) {
		// console.log(`=====> Client disconnected: ${client.id}`);
	}

	@SubscribeMessage('events')
	onEvent(client: any, data: any): WsResponse<string> {
		//console.log(client, data)
		return ({event: 'events', data: 'test' })
	}
}