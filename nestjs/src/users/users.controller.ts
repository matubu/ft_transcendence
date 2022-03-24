import { Controller, Get, Session } from '@nestjs/common';
import { UsersService } from './users.service'
import * as secureSession from 'fastify-secure-session'

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}
}
