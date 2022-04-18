import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from 'src/channel/channel.entity';
import { ChannelService } from 'src/channel/channel.service';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { DeleteResult, Repository } from 'typeorm';
import { AccessChannel } from './access-channel.entity';

@Injectable()
export class AccessChannelService {
	constructor(
		@InjectRepository(AccessChannel)
		private accessRepository: Repository<AccessChannel>,
		@Inject(forwardRef(() => UserService))
		private readonly userService: UserService,
		@Inject(forwardRef(() => ChannelService))
		private readonly channelService: ChannelService,
	) {}

	async getAccess(channel: Channel): Promise<User[]>
	{
		const accesChannels = await this.accessRepository.find({ where: { channel: channel },
																	relations: ["user"] });
		let users: User[] = [];
		for (let i = 0; i < accesChannels.length; i++)
			users.push(accesChannels[i].user);
		return (users);
	}

	async found(id_user: number, id_channel: string, insert: boolean): Promise<{ user: User, channel: Channel }>
	{
		const user = await this.userService.get(id_user, []);
		const channel = await this.channelService.get(id_channel);
		const exist = await this.accessRepository.findOne({ where: {user: user, channel: channel }});
		if ((user == undefined || channel == undefined)
			|| (insert && exist != undefined)
			|| (!insert && exist == undefined))
			throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
		return { user, channel };
	}

	async insert(id_user: number, id_channel: string): Promise<AccessChannel>
	{
		return this.found(id_user, id_channel, true)
			.then(data => {
				return this.accessRepository
					.save({user: data.user, channel: data.channel});	
			});
	}

	async remove(id_user: number, id_channel: string): Promise<DeleteResult>
	{
		return this.found(id_user, id_channel, false)
			.then(data => {
				return this.accessRepository
					.delete({user: data.user, channel: data.channel});	
			});
	}

	async isAccess(id_user: number, id_channel: string): Promise<boolean>
	{
		const user = await this.userService.get(id_user, []);
		const channel = await this.channelService.get(id_channel);
		const access = await this.accessRepository.findOne({ where: {user: user, channel: channel} });
		if (access === undefined)
			return (false);
		return (true);
	}
}
