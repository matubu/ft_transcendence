import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelModule } from 'src/channel/channel.module';
import { UserAchievementModule } from 'src/user-achievement/user-achievement.module';
import { UserModule } from 'src/user/user.module';
import { AdminChannel } from './admin-channel.entity';
import { AdminChannelService } from './admin-channel.service';
import { AdminChannelSubscriber } from './admin-channel.subscriber';

@Module({
	imports: [TypeOrmModule.forFeature([AdminChannel]),
					forwardRef(() => UserModule),
					forwardRef(() => ChannelModule),
					forwardRef(() => UserAchievementModule)],
	providers: [AdminChannelService, AdminChannelSubscriber],
	exports: [AdminChannelService]
})
export class AdminModule {}
