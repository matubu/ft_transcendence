import { Controller, Get, Query, Param, Header, Res, Session, Redirect} from '@nestjs/common';
import { AuthService } from './auth.service'
import * as express from 'express';
import * as secureSession from 'fastify-secure-session'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Get()
	@Header('Content-Type', 'text/html')
	async QuerycodeToToken(@Query() query: any[],
	@Res({ passthrough: true }) response)
	{
		const token = await this.authService.codeToToken(query['code']);
		console.log(token['access_token']);
		response.setCookie('key', 'value', { path: '/' })
		//return token['access_token'];
		// set cookies info
		return '<script>window.close()</script>'
	}
}
