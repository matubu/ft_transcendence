import { Body, Controller, Post, Put } from '@nestjs/common';
import { Autorization } from 'src/auth.guard';
import { DeleteResult, UpdateResult } from 'typeorm';
import { Notification } from './notification.entity';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
	constructor(private readonly notificationService: NotificationService) {}
	@Post('read')
	async read(@Autorization() userId: number, @Body() body: { notification_id: number }): Promise<Notification>
	{
		return await this.notificationService.markReadOne(userId, body.notification_id);
	}

	@Put('readAll')
	async readAll(@Autorization() userId: number): Promise<UpdateResult>
	{
		return await this.notificationService.markReadAll(userId);
	}

	@Post('remove')
	async remove(@Autorization() userId: number, @Body() body: { notification_id: number }): Promise<DeleteResult>
	{
		return await this.notificationService.removeNotification(userId, body.notification_id);
	}

	@Put('removeAll')
	async removeAll(@Autorization() userId: number): Promise<DeleteResult>
	{
		return await this.notificationService.removeAll(userId);
	}
}
