import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AchievementModule } from 'src/achievement/achievement.module';
import { UserModule } from 'src/user/user.module';
import { UserAchievement } from './user-achievement.entity';
import { UserAchievementService } from './user-achievement.service';

@Module({
	imports: [TypeOrmModule.forFeature([UserAchievement]), AchievementModule, forwardRef(() => UserModule)],
	providers: [UserAchievementService],
	exports: [UserAchievementService]
})
export class UserAchievementModule {}
