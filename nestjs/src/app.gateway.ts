import {
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	WsResponse,
} from '@nestjs/websockets'
import { Server } from 'ws'
// import { UnauthorizedException } from '@nestjs/common'
//import { Autorization } from './auth.guard'


let clients: Map<number, any> = new Map()

@WebSocketGateway(3000)
export class AppGateway {
	@WebSocketServer()
	server: Server;

	handleConnection(client: any) {
		client.terminate()
		console.log(`=====> Client {} connected`);
	}

	handleDisconnect(client: any) {
		console.log(`=====> Client {} disconnected`);
	}

	@SubscribeMessage('events')
	onEvent(client: any, data: any): WsResponse<string> {
		console.log('=====> Client {} event')
		return ({ event: 'events', data: 'test' })
	}
}
