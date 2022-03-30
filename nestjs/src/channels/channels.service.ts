import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channels } from './entity/channels.entity'
import { ChannelsInterface } from './interfaces/channels.interface'
import * as bcrypt from 'bcrypt';

@Injectable()
export class ChannelsService {
	constructor(
	@InjectRepository(Channels)
		private channelsRepository: Repository<Channels>,
	) {}

	async getAll() : Promise<Channels[]>
	{ return this.channelsRepository.find(); }

	async getChannelUser(idUser: number) : Promise<Channels[]>
	{
		const joinChannel = await this.channelsRepository
		.createQueryBuilder("Channels")
		.where(":users = ANY(Channels.users) OR private = false", { users: idUser })
		.getMany();

		return joinChannel;
	}

	async createChannel(idAdmin: number, channel: ChannelsInterface): Promise<Channels>
	{
		const newChannels = new Channels();
		newChannels.id_admin = idAdmin;
		newChannels.users= [idAdmin];
		if (channel.name?.length)
			newChannels.name = channel.name;
		if (channel.password?.length)
			newChannels.password = await bcrypt.hash(channel.password, await bcrypt.genSalt());
		// for decrypt
		// const isMatch = await bcrypt.compare(password, hash);
		
		if (channel.description?.length)
			newChannels.description = channel.description;
		newChannels.private = channel.private;
		return await this.channelsRepository.save(newChannels)
	}
}

