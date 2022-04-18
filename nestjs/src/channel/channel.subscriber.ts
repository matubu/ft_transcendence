import { forwardRef, Inject } from '@nestjs/common';
import { UserAchievementService } from 'src/user-achievement/user-achievement.service';
import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm';
import { Channel } from './channel.entity';

@EventSubscriber()
export class ChannelSubscriber implements EntitySubscriberInterface<Channel> {
	constructor(connection: Connection,
				@Inject(forwardRef(() => UserAchievementService))
				private readonly userAchievementService: UserAchievementService) {
		connection.subscribers.push(this);
	}

	listenTo() {
		return Channel;
	}

	async afterInsert(event: InsertEvent<Channel>): Promise<void> {
		let userID = event.entity.owner.id;
		this.userAchievementService.insert(userID, "I am the boss");
	}
}