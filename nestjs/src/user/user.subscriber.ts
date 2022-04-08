import { AlcoholService } from 'src/alcohol/alcohol.service';
import { Connection, EntitySubscriberInterface, EventSubscriber, UpdateEvent } from 'typeorm';
import { User } from './user.entity';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
	constructor(connection: Connection,
				private readonly alcoholService: AlcoholService) {
		connection.subscribers.push(this);
	}

	listenTo() {
		return User;
	}

	async beforeUpdate(event: UpdateEvent<User>): Promise<void> {
		const nickname: string = event.entity.nickname;
		if (nickname === undefined || nickname == null)
			return ;
		else
			console.log("Achievement YourName.");
		const creators: string[] = ["mberger-", "mmehran", "bledda"];
		if (await this.alcoholService.isAlcohol(nickname))
			console.log("Achievement alcolique");
		else if (creators.includes(nickname.toLowerCase()))
			console.log("Achievement Usurpateur");
	}
}