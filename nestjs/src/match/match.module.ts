import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAchievementModule } from 'src/user-achievement/user-achievement.module';
import { UserModule } from 'src/user/user.module';
import { Match } from './match.entity';
import { MatchService } from './match.service';
import { MatchSubscriber } from './match.subscriber';

@Module({
	imports: [TypeOrmModule.forFeature([Match]),
				UserModule,
				UserAchievementModule],
	providers: [MatchService, MatchSubscriber],
	exports: [MatchService]
})
export class MatchModule {}
