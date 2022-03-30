import { Controller, Post, Body, Get } from '@nestjs/common'
import { ChannelsService } from './channels.service'
import { Channels } from  './entity/channels.entity'
import { ChannelsInterface } from './interfaces/channels.interface'
import { Autorization } from '../auth.guard'

@Controller('channels')
export class ChannelsController {
	constructor(private readonly channelsService: ChannelsService) {}

	@Post()
	async createChannel(@Autorization() userId: number, @Body() channel: ChannelsInterface) : Promise<Channels>
	{
		return await this.channelsService.createChannel(userId, channel);
	}

	@Get()
	async getAll(@Autorization() userId: number) : Promise<Channels[]>
	{
		return await this.channelsService.getChannelUser(userId);
	}
}
