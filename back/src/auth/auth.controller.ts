import { Controller, Get, Query, Param } from '@nestjs/common';
import { AuthService } from './auth.service'
import { Token } from './interfaces/token.interface';
import { Error } from './interfaces/error.interface';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}
// https://api.intra.42.fr/oauth/authorize?client_id=5fb8cff19443b1e91c5753666fdcb12d45ecbc49c667ba7eb97150cb2590b38a&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth&response_type=code
	@Get()
	QuerycodeToToken(@Query() query: any[]): Error | Token
	{ return (this.codeToToken(query['code'])); }

	@Get(':code')
	codeToToken(@Param('code') code: string): Error | Token
	{ return (this.authService.codeToToken(code)); }
}
