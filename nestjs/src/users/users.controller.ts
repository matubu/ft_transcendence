import { Controller, Get, Param, Post, Body, Delete, Req, Put, Res } from '@nestjs/common';
import { UsersService } from './users.service'
import { Users } from './entity/users.entity';
import { UsersInterface } from './interfaces/users.interface';
import { CodeInterface } from './interfaces/code.interface';
import { FastifyRequest } from 'fastify';

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
	update(@Body() user_interface: UsersInterface, @Req() req: FastifyRequest)
	{
		const validUser = req.unsignCookie(req.cookies.user);
		if (!validUser?.valid) return;
		
		return this.usersService.update(user_interface);}

	@Get(':id')
	getOne(@Param('id') id: string) : Promise<Users>
	{ return this.usersService.findOne(id); }

	@Delete(':id')
	remove(@Param('id') id: string, @Req() req: FastifyRequest)
	{
		const validUser = req.unsignCookie(req.cookies.user);
		if (!validUser?.valid) return;

		return this.usersService.remove(id);
	}

	@Post('check_code')
	async check_code(@Body() body: CodeInterface, @Req() req: FastifyRequest, @Res({ passthrough: true }) response): Promise<boolean>
	{
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
		const validUser = req.unsignCookie(req.cookies.user);
		if (!validUser?.valid) return;

		const cookie = req.unsignCookie(req.cookies.userid);
		if (!cookie?.valid) return;
		const id = cookie.value;
		if (!id) return;
		return await this.usersService.activate_2fa(id);
	}

	@Get("disable_2fa")
	disable_no_error() {}
	@Put("disable_2fa")
	async disable_2fa(@Req() req: FastifyRequest)
	{
		const validUser = req.unsignCookie(req.cookies.user);
		if (!validUser?.valid) return;

		const cookie = req.unsignCookie(req.cookies.userid);
		if (!cookie?.valid) return;
		const id = cookie.value;
		if (!id) return;
		return await this.usersService.disable_2fa(id);
	}
	
}
