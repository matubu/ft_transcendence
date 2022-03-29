import { Controller, Get, Param, Post, Body, Req } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { Messages } from './entity/messages.entity'
import { MessagesInterface } from './interfaces/messages.interface'
import { FastifyRequest } from 'fastify';

@Controller('messages')
export class MessagesController {
	constructor(private readonly messagesService: MessagesService) {}

	@Get(':id_channel')
	async getMessageChannel(@Param(':id_channel') id_channel: string) : Promise<Messages[]>
	{
		return await this.messagesService.getMessageChannel(+id_channel);
	}

	@Get(':id_channel/:page')
	async getMessageChannelPage(@Param(':id_channel') id_channel: string,
								@Param(':page') page: string) : Promise<Messages[]>
	{
		return await this.messagesService.getMessageChannelPage(+id_channel, +page);
	}

	@Post('send')
	async insert(@Body() message: MessagesInterface, @Req() req: FastifyRequest): Promise<void>
	{
		if (!req.cookies.user) return ;
		const validUser = req.unsignCookie(req.cookies.user);
		if (!validUser?.valid) return;

		await this.messagesService.insert(+validUser.value, message);
	}
}
