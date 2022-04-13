import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelService } from 'src/channel/channel.service';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { Message } from './message.entity';

@Injectable()
export class MessageService {
	constructor(
		@InjectRepository(Message)
		private messageRepository: Repository<Message>,
		@Inject(forwardRef(() => UserService))
		private readonly userService: UserService,
		@Inject(forwardRef(() => ChannelService))
		private readonly channelService: ChannelService
	) {}

	async insert(id_user: number, id_channel: number, msg: string): Promise<{userId: number, msg: string}>
	{
		if (await this.channelService.isAccess(id_user, id_channel) == false)
			throw new UnauthorizedException();
		const user = await this.userService.get(id_user, []);
		const channel = await this.channelService.get(id_channel);
		await this.messageRepository.save({ user: user, channel: channel, msg: msg });
		return ({userId: id_user, msg: msg})
	}

	async getMessages(id_channel: number): Promise<Message[]>
	{
		const channel = await this.channelService.get(id_channel);
		return (await this.messageRepository.find({ where: {channel: channel},
												order: { id: "DESC"},
												take: 100,
												select: ["userId", "msg"] })).reverse();
	}
}
