import { forwardRef, HttpException, HttpStatus, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessChannel } from 'src/access-channel/access-channel.entity';
import { AccessChannelService } from 'src/access-channel/access-channel.service';
import { AdminChannel } from 'src/admin-channel/admin-channel.entity';
import { AdminChannelService } from 'src/admin-channel/admin-channel.service';
import { UserService } from 'src/user/user.service';
import { DeleteResult, Repository } from 'typeorm';
import { Channel } from './channel.entity';
import { ChannelInterface } from './channel.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ChannelService {
	constructor(
		@InjectRepository(Channel)
		private channelRepository: Repository<Channel>,
		@Inject(forwardRef(() => AdminChannelService))
		private readonly adminChannelService: AdminChannelService,
		@Inject(forwardRef(() => AccessChannelService))
		private readonly accessChannelService: AccessChannelService,
		@Inject(forwardRef(() => UserService))
		private readonly userService: UserService
	) {}

	async getALL(): Promise<Channel[]>
	{
		return this.channelRepository.find();
	}

	async get(id: number): Promise<Channel>
	{
		return this.channelRepository.findOne({ where: { id:id } });
	}

	async create(id_user: number, channel: ChannelInterface): Promise<Channel>
	{
		const owner = await this.userService.get(id_user, []);
		if (owner === undefined)
			throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
		if (channel.password === undefined)
			channel.password = await bcrypt.hash(channel.password, 10);
		return this.channelRepository.save({ owner: owner,
												name: channel.name,
												password: channel.password,
												description: channel.description,
												private: channel.private
											});
	}

	async isOwner(id_user: number, id_channel: number): Promise<boolean>
	{
		const channel = await this.get(id_channel);
		const user = await this.userService.get(id_user, []);
		if (user == undefined || channel == undefined)
			throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
		if (channel.owner.id == user.id)
			return true;
		return false;
	}

	async isAccess(id_user: number, id_channel: number): Promise<boolean>
	{
		if (await this.isOwner(id_user, id_channel) == true
		|| await this.accessChannelService.isAccess(id_user, id_channel) == true
		|| await this.adminChannelService.isAdmin(id_user, id_channel) == true)
			return true;
		return false;
	}

	async remove(id_channel: number): Promise<DeleteResult>
	{
		return this.channelRepository.delete({ id: id_channel });	
	}
	
	async addAdmin(id_user: number, id_owner: number, id_channel: number): Promise<AdminChannel>
	{
		if (await this.isOwner(id_owner, id_channel) == false)
			throw new UnauthorizedException()
		return this.adminChannelService.insert(id_user, id_channel);
	}

	async addAccess(id_user: number, id_channel: number, password?: string): Promise<AccessChannel>
	{
		const channel = await this.get(id_channel);
		if (channel != undefined && channel.password != undefined)
			if (password == undefined || await bcrypt.compare(password, channel.password) == false)
				throw new UnauthorizedException()
		return this.accessChannelService.insert(id_user, id_channel);
	}

	async removeAdmin(id_user: number, id_owner: number, id_channel: number): Promise<DeleteResult>
	{
		if (await this.isOwner(id_owner, id_channel) == false)
			throw new UnauthorizedException()
		return this.adminChannelService.remove(id_user, id_channel);
	}

	async removeAccess(id_user: number, id_admin: number, id_channel: number): Promise<DeleteResult>
	{
		if (await this.adminChannelService.isAdmin(id_admin, id_channel) == false
		&& await this.isOwner(id_admin, id_channel) == false)
			throw new UnauthorizedException()
		return this.accessChannelService.remove(id_user, id_channel);
	}
}
