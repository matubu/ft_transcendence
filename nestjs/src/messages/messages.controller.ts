import { Controller, Get, Param } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { Messages } from './entity/messages.entity'

@Controller('messages')
export class MessagesController {
	constructor(private readonly messagesService: MessagesService) {}

	@Get(':id_channel')
	async getMessageChannel(@Param(':id_channel') id_channel: string) : Promise<Messages[]>
	{
		return await this.messagesService.getMessageChannel(+id_channel);
	}
}
