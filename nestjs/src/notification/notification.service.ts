import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Notification } from './notification.entity';

@Injectable()
export class NotificationService {
	constructor(
		@InjectRepository(Notification)
		private notificationRepository: Repository<Notification>,
		private readonly userService: UserService
	) {}

	// async find(id_user: number): Promise<Notification[]>
	// {
	// 	const user = await this.userService.get(id_user, []);
	// 	return this.notificationRepository.findBy({ receiver: user });
	// }

	async insert(id_user: number, msg: string, id_sender: number ): Promise<Notification>
	{
		const receiver = await this.userService.get(id_user, []);
		const sender = await this.userService.get(id_sender, []);
		return this.notificationRepository.save({ receiver: receiver, sender: sender, msg: msg });
	}

	async removeNotification(id_notification: number): Promise<DeleteResult>
	{
		return this.notificationRepository.delete({ id: id_notification });
	}

	async removeAll(id_user: number): Promise<DeleteResult>
	{
		const receiver = await this.userService.get(id_user, []);
		return this.notificationRepository.delete({ receiver: receiver });
	}

	async markReadOne(id_notification: number): Promise<Notification>
	{
		return this.notificationRepository.save({ id: id_notification, seen: true });
	}

	async markReadAll(id_user: number): Promise<UpdateResult>
	{
		const receiver = await this.userService.get(id_user, ["notifications"]);
		return this.notificationRepository.update({ receiver: receiver }, { seen: true });
	}
}
