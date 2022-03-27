import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Controller('rank')
export class RankController {
	constructor(private readonly usersService: UsersService) {}
	
	@Get()
	async getAll()
	{
		return await this.usersService.findRank();
	}

	@Get(':number')
	async getNumber(@Param('number') number: string)
	{
		return await this.usersService.findRankNumber(number);
	}
}
