import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Messages } from './entity/messages.entity'
import { MessagesInterface } from './interfaces/messages.interface'

@Injectable()
export class MessagesService {
	constructor(
		@InjectRepository(Messages)
		private messagesRepository: Repository<Messages>,
	) {}
	
	getMessageChannel(idChanel: number): Promise<Messages[]>
	{
		return this.messagesRepository.find({
						order: {id: "DESC"},
						where: {id_channel: idChanel},
						take: 100 }
		); 
	}

	getMessageChannelPage(idChanel: number, page: number): Promise<Messages[]>
	{
		return this.messagesRepository.find({
						order: {id: "DESC"},
						where: {id_channel: idChanel},
						skip: +page * 100, 
						take: 100 }
		); 
	}

	async insert(idUser: number, message: MessagesInterface)
	{
		const newMessage = new Messages();
		newMessage.id_user = idUser;
		newMessage.id_channel = message.id_channel;
		newMessage.msg = message.msg;
		await this.messagesRepository.save(newMessage)
	}
}
