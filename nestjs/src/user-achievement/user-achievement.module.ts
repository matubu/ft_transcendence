import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AchievementModule } from 'src/achievement/achievement.module';
import { NotificationModule } from 'src/notification/notification.module';
import { UserModule } from 'src/user/user.module';
import { UserAchievement } from './user-achievement.entity';
import { UserAchievementService } from './user-achievement.service';
import { UserAchievementSubscriber } from './user-achievement.subscriber';

@Module({
	imports: [TypeOrmModule.forFeature([UserAchievement]),
				forwardRef(() => AchievementModule),
				forwardRef(() => UserModule),
				NotificationModule],
	providers: [UserAchievementService, UserAchievementSubscriber],
	exports: [UserAchievementService]
})
export class UserAchievementModule {}
