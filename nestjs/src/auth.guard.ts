import { createParamDecorator, UnauthorizedException, ExecutionContext } from '@nestjs/common'

export const Autorization = createParamDecorator((_, ctx: ExecutionContext): number => {
	const req = ctx.switchToHttp().getRequest();
	const cookie = req.cookies.user

	if (!cookie)
		throw new UnauthorizedException()

	const user = req.unsignCookie(cookie)
	if (!user?.valid || user.value === '' || +user.value === NaN)
		throw new UnauthorizedException()

	return (+user.value)
});