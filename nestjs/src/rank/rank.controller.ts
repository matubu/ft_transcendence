import { Controller, Get } from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { RankService } from './rank.service';

@Controller('rank')
export class RankController {
	constructor(private readonly rankService: RankService) {}

	@Get()
	async rank(): Promise<User[]>
	{
		return await this.rankService.rank();
	}
}
