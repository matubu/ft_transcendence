import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from './channel.entity';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';
import { AdminModule } from 'src/admin-channel/admin-channel.module';
import { AccessModule } from 'src/access-channel/access-channel.module';
import { UserModule } from 'src/user/user.module';
import { MessageModule } from 'src/message/message.module';
import { BlacklistChannelModule } from 'src/blacklist-channel/blacklist-channel.module';
import { ChannelSubscriber } from './channel.subscriber';
import { UserAchievementModule } from 'src/user-achievement/user-achievement.module';
import { AppModule } from 'src/app.module';

@Module({
	imports: [TypeOrmModule.forFeature([Channel]),
				forwardRef(() => AdminModule),
				forwardRef(() => AccessModule),
				forwardRef(() => UserModule),
				forwardRef(() => MessageModule),
				BlacklistChannelModule,
				forwardRef(() => UserAchievementModule),
				forwardRef(() => AppModule)],
	controllers: [ChannelController],
	providers: [ChannelService, ChannelSubscriber],
	exports: [ChannelService]
})
export class ChannelModule {}
