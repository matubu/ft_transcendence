import { Controller, Get, Param, Post, Body, Req } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { Messages } from './entity/messages.entity'
import { MessagesInterface } from './interfaces/messages.interface'
import { Autorization } from '../auth.guard';

@Controller('messages')
export class MessagesController {
	constructor(private readonly messagesService: MessagesService) {}

	@Get(':idChannel')
	async getMessageChannel(@Autorization() userId: number, 
							@Param('idChannel') idChannel: string) : Promise<Messages[]>
	{
		return await this.messagesService.getMessageChannelPage(userId, +idChannel, 0);
	}

	@Get(':idChannel/:page')
	async getMessageChannelPage(@Autorization() userId: number,
								@Param('idChannel') idChannel: string,
								@Param('page') page: string) : Promise<Messages[]>
	{
		return await this.messagesService.getMessageChannelPage(userId, +idChannel, +page);
	}

	@Post('send')
	async insert(@Autorization() userId: number, @Body() message: MessagesInterface): Promise<void>
	{
		await this.messagesService.insert(userId, message);
	}
}
