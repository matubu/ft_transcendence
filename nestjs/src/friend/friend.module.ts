import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend } from './friend.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Friend])]
})
export class FriendModule {}
