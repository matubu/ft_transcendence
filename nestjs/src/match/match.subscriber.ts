import { UserAchievementService } from 'src/user-achievement/user-achievement.service';
import { Connection, EntitySubscriberInterface, EventSubscriber, UpdateEvent } from 'typeorm';
import { Match } from './match.entity';
import { MatchService } from './match.service';

@EventSubscriber()
export class MatchSubscriber implements EntitySubscriberInterface<Match> {
	constructor(connection: Connection,
				private readonly userAchievementService: UserAchievementService,
				private readonly matchService: MatchService) {
		connection.subscribers.push(this);
	}

	listenTo() {
		return Match;
	}

	async afterUpdate(event: UpdateEvent<Match>): Promise<void> {
		console.log(event.entity);
	}
}