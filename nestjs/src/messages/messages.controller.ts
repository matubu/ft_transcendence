import { Controller, Get, Param, Post, Body, Req } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { Messages } from './entity/messages.entity'
import { MessagesInterface } from './interfaces/messages.interface'
import { Autorization } from '../auth.guard';

@Controller('messages')
export class MessagesController {
	constructor(private readonly messagesService: MessagesService) {}

	@Get(':idChannel')
	async getMessageChannel(@Param('idChannel') idChannel: string) : Promise<Messages[]>
	{
		return await this.messagesService.getMessageChannel(+idChannel);
	}

	@Get(':idChannel/:page')
	async getMessageChannelPage(@Param('idChannel') idChannel: string,
								@Param('page') page: string) : Promise<Messages[]>
	{
		return await this.messagesService.getMessageChannelPage(+idChannel, +page);
	}

	@Post('send')
	async insert(@Autorization() userId: number, @Body() message: MessagesInterface): Promise<void>
	{
		await this.messagesService.insert(userId, message);
	}
}
