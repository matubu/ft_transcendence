import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { AdminChannel } from 'src/admin-channel/admin-channel.entity';
import { Autorization } from 'src/auth.guard';
import { Message } from 'src/message/message.entity';
import { MessageService } from 'src/message/message.service';
import { DeleteResult } from 'typeorm';
import { Channel } from './channel.entity';
import { ChannelInterface } from './channel.interface';
import { ChannelService } from './channel.service';
import { User } from 'src/user/user.entity';
import { BlacklistChannel } from 'src/blacklist-channel/blacklist-channel.entity';

@Controller('channel')
export class ChannelController {
	constructor(private readonly channelService: ChannelService,
				private readonly messageService: MessageService) {}

	@Get()
	async getAll(): Promise<Channel[]>
	{
		return await this.channelService.getALL();
	}

	@Get(':id_channel/users')
	async getUsers(@Param('id_channel', ParseIntPipe) id_channel: number): Promise<User[]>
	{
		return await this.channelService.getUsers(id_channel);
	}

	@Get(':id_channel/usersBan')
	async getUsersBan(@Param('id_channel', ParseIntPipe) id_channel: number): Promise<User[]>
	{
		return await this.channelService.getUsersBan(id_channel);
	}

	@Post()
	async create(@Autorization() userId: number, @Body() body: ChannelInterface): Promise<Channel>
	{
		const channel: ChannelInterface = {
			name: body?.name ?? undefined,
			password: body?.password ?? undefined,
			description: body?.description ?? undefined,
			private: body?.private ?? false
		};
		return await this.channelService.create(userId, channel);
	}

	@Get(':id_channel')
	async access(@Param('id_channel', ParseIntPipe) id_channel: number,
					@Autorization() userId: number,
					@Body() body: { password?: string }): Promise<Message[]>
	{
		const access = await this.channelService.isAccess(userId, id_channel);
		if (!access)
			await this.channelService.addAccess(userId, id_channel, body?.password);
		return await this.messageService.getMessages(id_channel);
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

	@Post(':id_channel/ban')
	async ban(@Param('id_channel', ParseIntPipe) id_channel: number,
					@Autorization() sudo: number,
					@Body() body: { id_user: number }): Promise<BlacklistChannel>
	{
		return await this.channelService.banUser(body.id_user, sudo, id_channel);
	}

	@Delete(':id_channel/unban')
	async unban(@Param('id_channel', ParseIntPipe) id_channel: number,
					@Autorization() sudo: number,
					@Body() body: { id_user: number }): Promise<DeleteResult>
	{
		return await this.channelService.unbanUser(body.id_user, sudo, id_channel);
	}
}