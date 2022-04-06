import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { AdminChannel } from 'src/admin-channel/admin-channel.entity';
import { Autorization } from 'src/auth.guard';
import { DeleteResult } from 'typeorm';
import { Channel } from './channel.entity';
import { ChannelInterface } from './channel.interface';
import { ChannelService } from './channel.service';

@Controller('channel')
export class ChannelController {
	constructor(private readonly channelService: ChannelService) {}

	@Get()
	async getAll(): Promise<Channel[]>
	{
		return await this.channelService.getALL();
	}

	@Post()
	async create(@Autorization() userId: number, @Body() body: ChannelInterface): Promise<Channel>
	{
		const channel: ChannelInterface = {
			name: body.name,
			password: body.password,
			description: body.description,
			private: body.private
		};
		return await this.channelService.create(userId, channel);
	}

	@Get(':id_channel')
	async access(@Param('id_channel', ParseIntPipe) id_channel: number,
					@Autorization() userId: number,
					@Body() body: { password?: string }): Promise<boolean>
	{
		const access = await this.channelService.isAccess(userId, id_channel);
		if (!access)
			await this.channelService.addAccess(userId, id_channel, body.password);
		return true;
		// return msg[]
	}

	@Post(':id_channel/addAdmin')
	async addAdmin(@Param('id_channel', ParseIntPipe) id_channel: number,
					@Autorization() owner: number,
					@Body() body: { id_user: number }): Promise<AdminChannel>
	{
		return await this.channelService.addAdmin(body.id_user, owner, id_channel);
	}

	@Delete(':id_channel/removeAdmin')
	async removeAdmin(@Param('id_channel', ParseIntPipe) id_channel: number,
					@Autorization() owner: number,
					@Body() body: { id_user: number }): Promise<DeleteResult>
	{
		return await this.channelService.removeAdmin(body.id_user, owner, id_channel);
	}

	@Delete(':id_channel/removeAccess')
	async removeAccess(@Param('id_channel', ParseIntPipe) id_channel: number,
					@Autorization() sudo: number,
					@Body() body: { id_user: number }): Promise<DeleteResult>
	{
		return await this.channelService.removeAccess(body.id_user, sudo, id_channel);
	}
}
