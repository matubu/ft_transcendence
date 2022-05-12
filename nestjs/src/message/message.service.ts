import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelService } from 'src/channel/channel.service';
import { UserService } from 'src/user/user.service';
import { DeleteResult, Repository } from 'typeorm';
import { Message } from './message.entity';
import { User } from 'src/user/user.entity';
import { Channel } from 'src/channel/channel.entity';

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

	async insert(id_user: number, id_channel: string, msg: string): Promise<Message>
	{
		const user = await this.userService.get(id_user, []);
		return this.insertByUser(user, id_channel, msg);
	}

	async insertByUser(user: User, id_channel: string, msg: string): Promise<Message>
	{
		if (await this.channelService.isAccess(user.id, id_channel) == false)
			throw new UnauthorizedException();
		const channel = await this.channelService.get(id_channel);
		const ret = await this.messageRepository.save({ user: user, channel: channel, msg: msg });
		return this.messageRepository.findOne({ where: { id: ret.id }, relations: ['user'] });
	}

	async getMessages(id_channel: string): Promise<Message[]>
	{
		const channel = await this.channelService.get(id_channel);
		return (await this.messageRepository.find({ where: {channel: channel},
												order: { id: "DESC"},
												select: ["userId", "msg"] })).reverse();
	}

	async removeAll(user: User): Promise<DeleteResult> {
		return this.messageRepository.delete({ user });
	}

	async removeMessagesChannel(channel: Channel) : Promise<DeleteResult> {
		return this.messageRepository.delete({ channel });
	}
}
