import {
	SubscribeMessage,
	WebSocketGateway,
	OnGatewayInit,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
	} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

@WebSocketGateway( {cors: { origin: '*'} } )
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server: Server;
	private logger: Logger = new Logger('AppGateway');

	@SubscribeMessage('msgToServer')
	handleMessage(client: Socket, payload: any): void {
		//this.server.emit('msgToClient', payload);
		this.server.to(payload.room).emit('msgToClient', payload);
	}

	@SubscribeMessage('joinRoom')
	joinRoom(client: Socket, room: string): void {
		client.join(room);
		client.emit("joinedRoom", room);
	}

	@SubscribeMessage('leaveRoom')
	leaveRoom(client: Socket, room: string): void {
		client.leave(room);
		client.emit("leftRoom", room);
	}

	afterInit(server: Server) {
		this.logger.log('Init');
	}

	handleDisconnect(client: Socket) {
		this.logger.log(`Client disconnected: ${client.id}`);
	}

	handleConnection(client: Socket, ...args: any[]) {
		this.logger.log(`Client connected: ${client.id}`);
	}
}
