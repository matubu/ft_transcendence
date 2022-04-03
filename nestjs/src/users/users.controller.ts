import { Controller, Get, Param, Post, Body, Delete, Req, Put, Res, UnauthorizedException } from '@nestjs/common'
import { UsersService } from './users.service'
import { Users } from './entity/users.entity'
import { UsersInterface } from './interfaces/users.interface'
import { UploadPicture } from './interfaces/uploadPicture.interface'
import { CodeInterface } from './interfaces/code.interface'
import { FriendInterface } from './interfaces/friend.interface'
import { FastifyRequest } from 'fastify'
import { DeleteResult } from 'typeorm'
import { Autorization } from '../auth.guard';
const { promisify } = require('util')
const { pipeline } = require('stream')
const pump = promisify(pipeline)
const fs = require('fs')

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}
	@Get()
	getAll() : Promise<Users[]>
	{ return this.usersService.findAll(); }

	// TODO: remove for prod
	// @Post('insert')
	// insert(@Body() user_interface: UsersInterface)
	// { return this.usersService.insert(user_interface); }

	@Post('update')
	async update(@Autorization() userId: number, @Body() user_interface: UsersInterface): Promise<boolean>
	{
		return await this.usersService.update({ ...user_interface, id: userId });
	}

	@Get(':id')
	getOne(@Param('id') id: string) : Promise<Users>
	{ return this.usersService.findOne(+id); }

	@Get('content/:str')
	getByContent(@Param('str') str: string) : Promise<Users[]>
	{ return this.usersService.findByContent(str); }

	@Delete()
	remove(@Autorization() userId: number): Promise<DeleteResult>
	{
		return this.usersService.remove(userId);
	}

	@Post('check_code')
	async check_code(@Body() body: CodeInterface, @Req() req: FastifyRequest, @Res({ passthrough: true }) response): Promise<boolean>
	{
		if (!req.cookies.userid)
			throw new UnauthorizedException()

		const user = req.unsignCookie(req.cookies.userid);
		if (!user?.valid || user.value === '')
			throw new UnauthorizedException()

		const userId: number = +user.value;

		const val = await this.usersService.check_code(userId, body.code)
		if (val)
			response.setCookie('user', userId,
							{
								sameSite: 'Strict',
								path: '/',
								signed: true
							});
		return val
	}

	@Put("activate_2fa")
	async activate_2fa(@Autorization() userId: number): Promise<string>
	{
		return await this.usersService.activate_2fa(userId);
	}

	@Put("disable_2fa")
	async disable_2fa(@Autorization() userId: number)
	{
		return await this.usersService.disable_2fa(userId);
	}
	
	@Post("add_friend")
	async add_friend(@Autorization() userId: number, @Body() body: FriendInterface)
	{
		await this.usersService.add_friend(userId, body.friend);
	}

	@Post("remove_friend")
	async remove_friend(@Autorization() userId: number, @Body() body: FriendInterface)
	{
		await this.usersService.remove_friend(userId, body.friend);
	}

	@Post('picture')
	async uploadPicture(@Autorization() userId: number, @Req() req: FastifyRequest) : Promise<UploadPicture>
	{
		const data = await req.file();
		/*
			Format gerer for resize img
			@jimp/jpeg
			@jimp/png
			@jimp/bmp
			@jimp/tiff
			@jimp/gif
		*/
		const valid_mime: string[] = [ "image/gif", "image/jpeg", "image/png", "image/bmp", "image/tiff" ];
		for (let i = 0; i < valid_mime.length; i++)
		{
			if (valid_mime[i] === data.mimetype)
			{
				await pump(data.file, fs.createWriteStream(process.cwd() + "/upload/tmp/" + data.filename));
				const url_img = await this.usersService.convert(data.filename);
				const user: UsersInterface = {
					id: userId,
					img: url_img
				}
				await this.usersService.update(user);
				const succes: UploadPicture = {
					status: "success",
					content: url_img
				}
				return (succes);
			}
		}
		const error: UploadPicture = {
			status: "error",
			content: "Format is not valid"
		}
		return (error);
	}
}
