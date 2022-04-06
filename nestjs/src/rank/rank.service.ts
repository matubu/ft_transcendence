import { Injectable } from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class RankService {
	constructor(private readonly userService: UserService) {}
	
	async rank(): Promise<User[]>
	{
		return this.userService.rank();
	}
}
