import { createParamDecorator, UnauthorizedException, ExecutionContext } from '@nestjs/common'

const signerFactory = require('fastify-cookie/signer')
const signer = signerFactory(process.env.SECRET_COOKIES)

export const unsign = (cookie: string): number => {
	if (!cookie)
		throw new UnauthorizedException()

	const user = signer.unsign(cookie)
	if (!user?.valid || user.value === '' || +user.value === NaN)
		throw new UnauthorizedException()

	return (+user.value)
}

export const Autorization = createParamDecorator((_, ctx: ExecutionContext): number => 
	unsign(ctx.switchToHttp().getRequest().cookies.user))