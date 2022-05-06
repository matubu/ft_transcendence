import { Achievement } from 'src/achievement/achievement.entity';
import { AchievementService } from 'src/achievement/achievement.service';
import { NotificationService } from 'src/notification/notification.service';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm';
import { UserAchievement } from './user-achievement.entity';
import { UserAchievementService } from './user-achievement.service';

@EventSubscriber()
export class UserAchievementSubscriber implements EntitySubscriberInterface<UserAchievement> {
	constructor(connection: Connection,
				private readonly notificationService: NotificationService,
				private readonly userAchievementService: UserAchievementService,
				private readonly userService: UserService,
				private readonly achievementService: AchievementService) {
		connection.subscribers.push(this);
	}

	listenTo() {
		return UserAchievement;
	}

	async afterInsert(event: InsertEvent<UserAchievement>): Promise<void> {
		const receiver: User = event.entity.user;
		const achievement: Achievement = event.entity.achievement;
		const user = this.userService.get(receiver.id, ['achievements']);
		const achievements = this.achievementService.getAchievements();
		if ((await user).achievements.length + 1 === (await achievements).length)
			this.userAchievementService.insert(receiver.id, "The end");
		this.notificationService.insert(receiver.id, "You have unlocked an achievement " + achievement.title, undefined, undefined);
	}
}
