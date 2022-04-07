import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from 'src/channel/channel.entity';
import { ChannelService } from 'src/channel/channel.service';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { DeleteResult, Repository } from 'typeorm';
import { AdminChannel } from './admin-channel.entity';

@Injectable()
export class AdminChannelService {
	constructor(
		@InjectRepository(AdminChannel)
		private adminRepository: Repository<AdminChannel>,
		@Inject(forwardRef(() => UserService))
		private readonly userService: UserService,
		@Inject(forwardRef(() => ChannelService))
		private readonly channelService: ChannelService
	) {}

	async getAdmins(channel: Channel): Promise<User[]>
	{
		const adminChannels = await this.adminRepository.find({ where: { channel: channel },
															relations: ["user"] });
		let users: User[] = [];
		for (let i = 0; i < adminChannels.length; i++)
			users.push(adminChannels[i].user);
		return (users);
	}

	async found(id_user: number, id_channel: number, insert: boolean): Promise<{ user: User, channel: Channel }>
	{
		const user = await this.userService.get(id_user, []);
		const channel = await this.channelService.get(id_channel);
		const exist = await this.adminRepository.findOne({ where: {user: user, channel: channel }});
		if ((user == undefined || channel == undefined)
			|| (insert && exist != undefined)
			|| (!insert && exist == undefined))
			throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
		return { user, channel };
	}

	async insert(id_user: number, id_channel: number): Promise<AdminChannel>
	{
		return this.found(id_user, id_channel, true)
			.then(data => {
				return this.adminRepository
					.save({user: data.user, channel: data.channel});	
			});
	}

	async remove(id_user: number, id_channel: number): Promise<DeleteResult>
	{
		return this.found(id_user, id_channel, false)
			.then(data => {
				return this.adminRepository
					.delete({user: data.user, channel: data.channel});	
			});
	}

	async isAdmin(id_user: number, id_channel: number): Promise<boolean>
	{
		const user = await this.userService.get(id_user, []);
		const channel = await this.channelService.get(id_channel);
		const access = this.adminRepository.findOne({ where: {user: user, channel: channel} });
		if (access === undefined)
			return (false);
		return (true);
	}
}
