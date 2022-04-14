import { AppGateway } from "src/app.gateway";
import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent } from "typeorm";
import { Notification } from './notification.entity';

@EventSubscriber()
export class NotificationSubscriber implements EntitySubscriberInterface<Notification> {
	constructor(connection: Connection,
		private readonly gateway: AppGateway) {
		connection.subscribers.push(this);
	}

	listenTo() {
		return Notification;
	}

	async afterInsert(event: InsertEvent<Notification>): Promise<void> {
		this.gateway.handleNotifcation(event.entity);
	}
}
