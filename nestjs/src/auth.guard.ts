import { createParamDecorator, UnauthorizedException, ExecutionContext } from '@nestjs/common';

export const Autorization = createParamDecorator((_, ctx: ExecutionContext): number => {
	const req = ctx.switchToHttp().getRequest();

	if (!req.cookies.user)
		throw new UnauthorizedException()

	const user = req.unsignCookie(req.cookies.user)
	if (!user?.valid || user.value === '' || +user.value === NaN)
		throw new UnauthorizedException()

	return (+user.value)
});