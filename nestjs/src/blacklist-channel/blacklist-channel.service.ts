import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelService } from 'src/channel/channel.service';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { DeleteResult, Repository } from 'typeorm';
import { BlacklistChannel } from './blacklist-channel.entity';
import { Channel } from 'src/channel/channel.entity';

@Injectable()
export class BlacklistChannelService {
	constructor(
		@InjectRepository(BlacklistChannel)
		private blackListRepository: Repository<BlacklistChannel>,
		@Inject(forwardRef(() => UserService))
		private readonly userService: UserService,
		@Inject(forwardRef(() => ChannelService))
		private readonly channelService: ChannelService
	) {}

	async isBan(id_user: number, id_channel: string): Promise<boolean>
	{
		const user = await this.userService.get(id_user, []);
		const channel = await this.channelService.get(id_channel);
		const blacklist = await this.blackListRepository.findOne({ where: { user: user, channel: channel } });
		if (blacklist == null || blacklist == undefined)
			return false;
		if (blacklist.date !== null && new Date <= blacklist.date)
		{
			this.unban(blacklist.user.id, blacklist.channel.id);
			return false;
		}
		return true;
	}

	async listBan(id_channel: string): Promise<User[]>
	{
		const channel = await this.channelService.get(id_channel);
		const listBan = await this.blackListRepository.find({ where: { channel: channel},
														relations: ["user"] });
		let users: User[] = [];
		for (let i = 0; i < listBan.length; i++)
		{
			if (listBan[i].date !== null && new Date >= listBan[i].date)
				users.push(listBan[i].user);
			else
				this.unban(listBan[i].user.id, listBan[i].channel.id);
		}
		return (users);
	}

	async ban(id_user: number, id_channel: string, date: Date = null): Promise<BlacklistChannel>
	{
		const user = await this.userService.get(id_user, []);
		const channel = await this.channelService.get(id_channel);
		return this.blackListRepository.save({ user, channel, date });
	}

	async unban(id_user: number, id_channel: string): Promise<DeleteResult>
	{
		const user = await this.userService.get(id_user, []);
		const channel = await this.channelService.get(id_channel);
		return this.blackListRepository.delete({ user: user, channel: channel });
	}

	async removeAll(user: User): Promise<DeleteResult> {
		return this.blackListRepository.delete({ user });
	}

	async removeUser(channel: Channel): Promise<void> {
		await this.blackListRepository.delete({ channel });
	}
}
