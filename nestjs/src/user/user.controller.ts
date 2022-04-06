import { Controller, Get, Post, Put, Req, HttpException, HttpStatus, Param, ParseIntPipe, Body, Res, UnauthorizedException, Delete } from '@nestjs/common';
import { UserService } from './user.service'
import { User } from './user.entity'
import { FastifyRequest } from 'fastify'
import { Picture } from 'src/picture/picture.entity'
import { Autorization } from '../auth.guard'
import { AuthService } from 'src/auth/auth.service';
import { DeleteResult } from 'typeorm';
import { Dfa } from 'src/dfa/dfa.entity';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService,
				private readonly authService: AuthService) {}

	/* NOT AUTHORIZATION REQUIRED */
	@Get(':id')
	async getByID(@Param('id', ParseIntPipe) id: number) : Promise<User>
	{ 
		const user = await this.userService.get(id,
					["picture", "friends", "achievements", "matchs"]);
		if (user != undefined)
			return user;
		throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
	}
	
	@Post('checkCode')
	async checkCode(@Body() body: { code: string }, @Req() req: FastifyRequest, @Res({ passthrough: true }) response): Promise<void>
	{
		if (!req.cookies.userid)
			throw new UnauthorizedException()

		const user = req.unsignCookie(req.cookies.userid);
		if (!user?.valid || user.value === '')
			throw new UnauthorizedException()

		const val = await this.userService.checkCode(+user.value, body.code)
		if (!val)
			throw new UnauthorizedException()
		this.authService.setCookie(response, "user", user.value);
	}
	
	/* AUTHORIZATION REQUIRED */
	@Get()
	async get(@Autorization() userId: number) : Promise<User> {
		return await this.userService.get(userId,
			["picture", "dfa", "friends", "ownerChannels",
			"adminChannels", "accessChannels", "notifications",
			"achievements", "matchs"]);
	}

	@Post('changePicture')
	async changePicture(@Autorization() userId: number, @Req() req: FastifyRequest): Promise<Picture>
	{
		const data = await req.file();
		const valid_mime: string[] = [ "image/gif", "image/jpeg", "image/png", "image/bmp", "image/tiff" ];
		if (valid_mime.includes(data.mimetype))
			return await this.userService.changePicture(userId, data.file);
		throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@Post('changeNickname')
	async changeNickname(@Autorization() userId: number, @Body() body: { nickname: string }) : Promise<User> {
		return await this.userService.changeNickname(userId, body.nickname);
	}

	@Delete()
	async delete(@Autorization() userId: number) : Promise<DeleteResult> {
		return await this.userService.remove(userId);
	}

	@Put('activate2FA')
	async activate2FA(@Autorization() userId: number) : Promise<Dfa> {
		return await this.userService.activate2FA(userId);
	}

	@Put('disable2FA')
	async disabled2FA(@Autorization() userId: number) : Promise<User> {
		return await this.userService.disabled2FA(userId);
	}
}
