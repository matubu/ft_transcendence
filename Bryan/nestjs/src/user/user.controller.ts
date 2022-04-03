import { Controller, Get, Post, Req, HttpException, HttpStatus, Param, ParseIntPipe, Body, Res, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service'
import { User } from './user.entity'
import { FastifyRequest } from 'fastify'
import { Picture } from 'src/picture/picture.entity'
import { Autorization } from '../auth.guard'
import { AuthService } from 'src/auth/auth.service';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService,
				private readonly authService: AuthService) {}

	/* NOT AUTHORIZATION REQUIRED */
	@Get(':id')
	async getByID(@Param('id', ParseIntPipe) id: number) : Promise<User>
	{ return await this.userService.get(id, ["picture", "friends"]); }
	
	@Post('checkCode')
	async checkCode(@Body() body: { code: string }, @Req() req: FastifyRequest, @Res({ passthrough: true }) response): Promise<boolean>
	{
		if (!req.cookies.userid)
			throw new UnauthorizedException()

		const user = req.unsignCookie(req.cookies.userid);
		if (!user?.valid || user.value === '')
			throw new UnauthorizedException()

		const val = await this.userService.checkCode(+user.value, body.code)
		if (val)
			this.authService.setCookie(response, "user", user.value);
		return val
	}
	
	/* AUTHORIZATION REQUIRED */
	@Get()
	async get(@Autorization() userId: number) : Promise<User> {
		return await this.userService.get(userId, ["picture", "friends", "ownerChannels",
												"adminChannels", "accessChannels",
												"notifications"]);
	}

	@Post()
	async uploadPicture(@Autorization() userId: number, @Req() req: FastifyRequest): Promise<Picture>
	{
		const data = await req.file();
		const valid_mime: string[] = [ "image/gif", "image/jpeg", "image/png", "image/bmp", "image/tiff" ];
		if (valid_mime.includes(data.mimetype))
			return await this.userService.changePicture(userId, data.file);
		throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
	}
}
