import * as WebSocket from 'ws'
import { WebSocketAdapter } from '@nestjs/common'
import { MessageMappingProperties } from '@nestjs/websockets'
import { unsign } from './auth.guard'

const getCookiesFromString = s => Object.fromEntries(s.split?.('; ').map(v => v.split('=')))

export class WsAdapter implements WebSocketAdapter {
	constructor() {}

	create(port: number, options: any = {}): any {
		return new WebSocket.Server({ port, ...options });
	}
	
	bindClientConnect(server, callback: Function) {
		server.on('connection', (client: WebSocket, req) => {
			try {
				client.userId = unsign(
					decodeURIComponent(
						getCookiesFromString(req.headers.cookie)['user']
					)
				)
				callback(client, req)
			}
			catch {
				client.terminate()
			}
		});
	}

	bindClientDisconnect(client: WebSocket, callback: Function) {
		client.on('close', callback);
	}

	bindMessageHandlers(
		client: WebSocket,
		handlers: MessageMappingProperties[]
	) {
		let map = Object.fromEntries(handlers.map(({message, callback}) => [message, callback]))

		client.on('message', msg => {
			let idx = msg.indexOf(':')
			if (idx === -1) return ;
			map[msg.slice(0, idx)]?.(JSON.parse(msg.slice(idx + 1)))
		})
	}

	close(server) {
		server.close();
	}
}