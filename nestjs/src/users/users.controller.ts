import { Controller, Get, Param, Post, Body, Delete, Req, Put, Res } from '@nestjs/common';
import { UsersService } from './users.service'
import { Users } from './entity/users.entity';
import { UsersInterface } from './interfaces/users.interface';
import { UploadPicture } from './interfaces/uploadPicture.interface';
import { CodeInterface } from './interfaces/code.interface';
import { FriendInterface } from './interfaces/friend.interface';
import { FastifyRequest } from 'fastify';
import { DeleteResult } from 'typeorm';
const util = require('util')
const { pipeline } = require('stream')
const pump = util.promisify(pipeline)
const fs = require('fs');

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}
	@Get()
	getAll() : Promise<Users[]>
	{ return this.usersService.findAll(); }

	// TODO: remove for prod
	@Post('insert')
	insert(@Body() user_interface: UsersInterface)
	{ return this.usersService.insert(user_interface); }

	@Post('update')
	async update(@Body() user_interface: UsersInterface, @Req() req: FastifyRequest): Promise<boolean>
	{
		if (!req.cookies.user) return false;
		const validUser = req.unsignCookie(req.cookies.user);
		if (!validUser?.valid) return false;
		return await this.usersService.update({ ...user_interface, id: +validUser.value });
	}

	@Get(':id')
	getOne(@Param('id') id: string) : Promise<Users>
	{ return this.usersService.findOne(id); }

	@Get('content/:str')
	getByContent(@Param('str') str: string) : Promise<Users[]>
	{ return this.usersService.findByContent(str); }

	@Delete(':id')
	remove(@Param('id') id: string, @Req() req: FastifyRequest): Promise<DeleteResult>
	{
		if (!req.cookies.user) return ;
		const validUser = req.unsignCookie(req.cookies.user);
		if (!validUser?.valid) return;

		return this.usersService.remove(id);
	}

	@Post('check_code')
	async check_code(@Body() body: CodeInterface, @Req() req: FastifyRequest, @Res({ passthrough: true }) response): Promise<boolean>
	{
		if (!req.cookies.userid) return ;
		const cookie = req.unsignCookie(req.cookies.userid);
		if (!cookie?.valid) return;
	
		const id = cookie.value;
		if (!id) return;
		const val = await this.usersService.check_code(id, body.code)
		if (val)
			response.setCookie('user', id,
							{
								path: '/',
								signed: true
							});
		return val
	}

	@Get("activate_2fa")
	activate_no_error() {}
	@Put("activate_2fa")
	async activate_2fa(@Req() req: FastifyRequest): Promise<string>
	{
		if (!req.cookies.user) return ;
		const validUser = req.unsignCookie(req.cookies.user);
		if (!validUser?.valid) return;

		const id = validUser.value;
		if (!id) return;
		return await this.usersService.activate_2fa(id);
	}

	@Get("disable_2fa")
	disable_no_error() {}
	@Put("disable_2fa")
	async disable_2fa(@Req() req: FastifyRequest)
	{
		if (!req.cookies.user) return ;
		const validUser = req.unsignCookie(req.cookies.user);
		if (!validUser?.valid) return;

		const id = validUser.value;
		if (!id) return;
		return await this.usersService.disable_2fa(id);
	}
	
	@Post("add_friend")
	async add_friend(@Req() req: FastifyRequest, @Body() body: FriendInterface)
	{
		if (!req.cookies.user) return ;
		const validUser = req.unsignCookie(req.cookies.user);
		if (!validUser?.valid) return;

		const id = validUser.value;
		if (!id) return;
		await this.usersService.add_friend(id, body.friend);
	}

	@Post("remove_friend")
	async remove_friend(@Req() req: FastifyRequest, @Body() body: FriendInterface)
	{
		if (!req.cookies.user) return ;
		const validUser = req.unsignCookie(req.cookies.user);
		if (!validUser?.valid) return;

		const id = validUser.value;
		if (!id) return;
		await this.usersService.remove_friend(id, body.friend);
	}

	@Post('picture')
	async uploadPicture(@Req() req: FastifyRequest) : Promise<UploadPicture>
	{
		if (!req.cookies.user) return ;
		const validUser = req.unsignCookie(req.cookies.user);
		if (!validUser?.valid) return;

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
					id: +req.unsignCookie(req.cookies.user).value,
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
