import { forwardRef, Inject } from "@nestjs/common";
import { AppGateway } from "src/app.gateway";
import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent } from "typeorm";
import { BlacklistChannel } from './blacklist-channel.entity';

@EventSubscriber()
export class BlacklistSubscriber implements EntitySubscriberInterface<BlacklistChannel> {
	constructor(connection: Connection,
		@Inject(forwardRef(() => AppGateway))
		private readonly gateway: AppGateway) {
		connection.subscribers.push(this);
	}

	listenTo() {
		return BlacklistChannel;
	}

	async afterInsert(event: InsertEvent<BlacklistChannel>): Promise<void> {
		this.gateway.sendBanEvent(event.entity);
	}
}
