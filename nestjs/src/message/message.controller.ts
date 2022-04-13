import { Body, Controller, Post } from '@nestjs/common';
import { Autorization } from 'src/auth.guard';
import { Message } from './message.entity';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
	constructor(private readonly messageService: MessageService) {}

	@Post()
	async insert(@Autorization() userId: number,
		@Body() body: { id_channel: number, msg: string }): Promise<{userId: number, msg: string}>
	{
		return await this.messageService.insert(userId, body.id_channel, body.msg);
	}
}
