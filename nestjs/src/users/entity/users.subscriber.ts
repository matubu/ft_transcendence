import { EntitySubscriberInterface, EventSubscriber, UpdateEvent } from 'typeorm';
import { Users } from './users.entity';
import { Logger } from '@nestjs/common';

//basic example
@EventSubscriber()
export class UsersSubscriber implements EntitySubscriberInterface<Users> {

	listenTo(): any {
		return Users;
	}

	afterLoad(entity: any) {
		console.log(`AFTER ENTITY LOADED: `, entity)
	}

	beforeUpdate(event: UpdateEvent<any>) {
		console.log(`BEFORE ENTITY UPDATED: `, event.entity)
	}

	afterUpdate(event: UpdateEvent<any>) {
		console.log(`AFTER ENTITY UPDATED: `, event.entity)
	}
}
