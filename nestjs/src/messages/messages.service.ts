import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Messages } from './entity/messages.entity'

@Injectable()
export class MessagesService {
	constructor(
		@InjectRepository(Messages)
		private usersRepository: Repository<Messages>,
	) {}
	
	getMessageChannel(idChanel: number): Promise<Messages[]>
	{
		return this.usersRepository.find({
						order: {id: "DESC"},
						where: {id_channel: idChanel},
						take: 100 }
		); 
	}

	getMessageChannelPage(idChanel: number, page: number,): Promise<Messages[]>
	{
		return this.usersRepository.find({
						order: {id: "DESC"},
						where: {id_channel: idChanel},
						skip: +page * 100, 
						take: 100 }
		); 
	}
}
