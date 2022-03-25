import { Controller, Get, Param, Post, Body, Delete } from '@nestjs/common';
import { UsersService } from './users.service'
import { Users } from './entity/users.entity';
import { UsersInterface } from './interfaces/users.interface';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}
	@Get()
	getAll() : Promise<Users[]>
	{ return this.usersService.findAll(); }

	@Post('insert')
	insert(@Body() user_interface: UsersInterface)
	{ return this.usersService.insert(user_interface); }

	@Post('update')
	update(@Body() user_interface: UsersInterface)
	{ return this.usersService.update(user_interface); }

	@Get(':id')
	getOne(@Param('id') id: string) : Promise<Users>
	{ return this.usersService.findOne(id); }

	@Delete(':id')
	remove(@Param('id') id: string)
	{ return this.usersService.remove(id); }
}
