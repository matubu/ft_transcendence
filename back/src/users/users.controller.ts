import { Controller, Get, Session } from '@nestjs/common';
import { UsersService } from './users.service'
import * as secureSession from 'fastify-secure-session'

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get('id')
	id(@Session() session: secureSession.Session) {
		const id = session.get('id');
		if (id === undefined)
			session.set('id', Math.random());
		return (session.get('id'));
	}
}
