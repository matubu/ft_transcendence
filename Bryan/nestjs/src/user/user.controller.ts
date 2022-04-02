import { Controller, Get, Post, Req, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service'
import { User } from './user.entity'
const fs = require("fs");
import { FastifyRequest } from 'fastify'
import { Picture } from 'src/picture/picture.entity'

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	async getAll() : Promise<User[]>
	{ return await this.userService.findAll(); }

	@Post()
	async uploadPicture(@Req() req: FastifyRequest): Promise<Picture>
	{
		const data = await req.file();
		const valid_mime: string[] = [ "image/gif", "image/jpeg", "image/png", "image/bmp", "image/tiff" ];
		if (valid_mime.includes(data.mimetype))
			return await this.userService.changePicture(0, data.file);
		throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
	}
}
