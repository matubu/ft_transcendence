import { Achievement } from 'src/achievement/achievement.entity';
import { NotificationService } from 'src/notification/notification.service';
import { User } from 'src/user/user.entity';
import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm';
import { UserAchievement } from './user-achievement.entity';

@EventSubscriber()
export class UserAchievementSubscriber implements EntitySubscriberInterface<UserAchievement> {
	constructor(connection: Connection,
				private readonly notificationService: NotificationService) {
		connection.subscribers.push(this);
	}

	listenTo() {
		return UserAchievement;
	}

	async afterInsert(event: InsertEvent<UserAchievement>): Promise<void> {
		const receiver: User = event.entity.user;
		const achievement: Achievement = event.entity.achievement;
		this.notificationService.insert(receiver.id, "Your are unlock achievement " + achievement.title, undefined, undefined);
	}
}