import { Body, Controller, Delete, Post } from '@nestjs/common';
import { FriendService } from './friend.service';
import { Autorization } from '../auth.guard'
import { DeleteResult } from 'typeorm';
import { Friend } from './friend.entity';

@Controller('friend')
export class FriendController {
	constructor(private readonly friendService: FriendService) {}

	@Post()
	async add(@Autorization() userId: number, @Body() body: { friend: number }): Promise<Friend> {
		return await this.friendService.insert(userId, body.friend);
	}
	
	@Delete()
	async remove(@Autorization() userId: number, @Body() body: { friend: number }): Promise<DeleteResult> {
		return await this.friendService.remove(userId, body.friend);
	}
}
