import { Controller, Get, Session } from '@nestjs/common';
import { SessionService } from './session.service'
import * as secureSession from 'fastify-secure-session'
import { Session_interface } from './interfaces/session.interface';

@Controller('session')
export class SessionController {
	constructor(private readonly sessionService: SessionService) {}
	@Get()
	getAll(@Session() session: secureSession.Session) : Session_interface
	{ return (this.sessionService.getAll(session)); }
}
