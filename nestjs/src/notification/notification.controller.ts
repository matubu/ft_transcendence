import { Body, Controller, Get, Post } from '@nestjs/common';
import { Autorization } from 'src/auth.guard';
import { Notification } from './notification.entity';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
	constructor(private readonly notificationService: NotificationService) {}

	// @Get()
	// async get(@Autorization() userId: number): Promise<Notification[]>
	// {
	// 	return await this.notificationService.find(userId);
	// }

	// @Post()
	// async read(@Autorization() userId: number, @Body() body: {notification_id: number}): Promise<Notification>
	// {
	// 	return await this.notificationService.markReadOne(body.notification_id);
	// }

	// @Post("readAll")
	// async readAll(@Autorization() userId: number): Promise<IDK>
	// {
	// 	return await this.notificationService.markReadAll(userId);
	// }

	// @Post()
	// async remove(@Autorization() userId: number, @Body() body: {notification_id: number}): Promise<Notification>
	// {
	// 	return await this.notificationService.removeNotification(body.notification_id);
	// }

	// @Post("removeAll")
	// async removeAll(@Autorization() userId: number): Promise<IDK>
	// {
	// 	return await this.notificationService.removeAll(userId);
	// }

}
