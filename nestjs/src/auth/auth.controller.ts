import { Controller, Get, Query, Param, Response, Session} from '@nestjs/common';
import { AuthService } from './auth.service'
import * as express from 'express';
import * as secureSession from 'fastify-secure-session'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}
// https://api.intra.42.fr/oauth/authorize?client_id=5fb8cff19443b1e91c5753666fdcb12d45ecbc49c667ba7eb97150cb2590b38a&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth&response_type=code
	@Get()
	QuerycodeToToken(	@Query() query: any[],
						@Response() response: express.Response,
						@Session() session: secureSession.Session)
	{ return (this.codeToToken(query['code'], response, session)); }

	@Get(':code')
	async codeToToken(	@Param('code') code: string,
						@Response() response: express.Response,
						@Session() session: secureSession.Session)
	{ 
		const token = await this.authService.codeToToken(code);
		if (token['access_token'] !== undefined)
			session.set('token', token['access_token']);
		return response.redirect(301, `http://localhost:8080/`);
	}
}
