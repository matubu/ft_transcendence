import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get()
	all(): string {
	  return this.usersService.all();
	}
	@Get(':a')
	id(@Param('a') a): string {
	  return this.usersService.id(a);
	}
}
