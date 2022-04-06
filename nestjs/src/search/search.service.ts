import { Injectable } from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class SearchService {
	constructor(private readonly userService: UserService) {}

	async search(search: string): Promise<User[]>
	{
		return this.userService.search(search);
	}
}
