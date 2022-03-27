import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Messages } from './entity/messages.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Messages])],
})
export class MessagesModule {}
