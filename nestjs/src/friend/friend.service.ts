import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { DeleteResult, Repository } from 'typeorm';
import { Friend } from './friend.entity';

@Injectable()
export class FriendService {
	constructor(
		@InjectRepository(Friend)
		private friendRepository: Repository<Friend>,
		private readonly userService: UserService
	) {}

	async found(id: number, id_friend: number, insert: boolean): Promise<{ user: User, friend: User }>
	{
		const user = await this.userService.get(id, []);
		const friend = await this.userService.get(id_friend, []);
		const exist = await this.friendRepository.findOne({ where: {user: user, friend: friend }});
		if ((user == undefined || friend == undefined)
			|| (insert && exist != undefined)
			|| (!insert && exist == undefined))
			throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
		return { user, friend };
	}

	async insert(id: number, id_friend: number): Promise<Friend>
	{
		return this.found(id, id_friend, true)
			.then(data => {
				return this.friendRepository
						.save({ user: data.user, friend: data.friend });	
			});
	}

	async remove(id: number, id_friend: number): Promise<DeleteResult>
	{
		return this.found(id, id_friend, false)
			.then(data => {
				return this.friendRepository
						.delete({ user: data.user, friend: data.friend });	
			});
	}
}
