import { forwardRef, Inject } from '@nestjs/common';
import { UserAchievementService } from 'src/user-achievement/user-achievement.service';
import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm';
import { AdminChannel } from './admin-channel.entity';

@EventSubscriber()
export class AdminChannelSubscriber implements EntitySubscriberInterface<AdminChannel> {
	constructor(connection: Connection,
				@Inject(forwardRef(() => UserAchievementService))
				private readonly userAchievementService: UserAchievementService) {
		connection.subscribers.push(this);
	}

	listenTo() {
		return AdminChannel;
	}

	async afterInsert(event: InsertEvent<AdminChannel>): Promise<void> {
		let userID = event.entity.user.id;
		this.userAchievementService.insert(userID, "I would ban you all");
	}
}