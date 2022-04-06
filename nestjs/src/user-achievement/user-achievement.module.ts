import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAchievement } from './user-achievement.entity';

@Module({
	imports: [TypeOrmModule.forFeature([UserAchievement])]
})
export class UserAchievementModule {}
