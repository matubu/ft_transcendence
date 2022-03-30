import { Controller, Get, Param, Post, Body, Req } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { Messages } from './entity/messages.entity'
import { MessagesInterface } from './interfaces/messages.interface'
import { FastifyRequest } from 'fastify';

@Controller('messages')
export class MessagesController {
	constructor(private readonly messagesService: MessagesService) {}

	@Get(':idChannel')
	async getMessageChannel(@Param('idChannel') idChannel: string) : Promise<Messages[]>
	{
		console.log("COUCOCU", idChannel)
		return await this.messagesService.getMessageChannel(+idChannel);
	}

	@Get(':idChannel/:page')
	async getMessageChannelPage(@Param('idChannel') idChannel: string,
								@Param('page') page: string) : Promise<Messages[]>
	{
		return await this.messagesService.getMessageChannelPage(+idChannel, +page);
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
