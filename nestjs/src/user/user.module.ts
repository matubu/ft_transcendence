import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DfaModule } from 'src/dfa/dfa.module';
import { PictureModule } from 'src/picture/picture.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserSubscriber } from './user.subscriber';
import { AlcoholModule } from 'src/alcohol/alcohol.module';
import { UserAchievementModule } from 'src/user-achievement/user-achievement.module';
import { NotificationModule } from 'src/notification/notification.module';
import { FriendModule } from 'src/friend/friend.module';
import { MatchModule } from 'src/match/match.module';
import { MessageModule } from 'src/message/message.module';
import { BlockModule } from 'src/block/block.module';
import { AccessModule } from 'src/access-channel/access-channel.module';
import { AdminModule } from 'src/admin-channel/admin-channel.module';
import { BlacklistChannelModule } from 'src/blacklist-channel/blacklist-channel.module';
import { ChannelModule } from 'src/channel/channel.module';

@Module({
	imports: [TypeOrmModule.forFeature([User]),
				DfaModule,
				PictureModule,
				AlcoholModule,
				forwardRef(() => FriendModule),
				forwardRef(() => NotificationModule),
				forwardRef(() => AuthModule),
				forwardRef(() => UserAchievementModule),
				forwardRef(() => MatchModule),
				forwardRef(() => MessageModule),
				forwardRef(() => BlockModule),
				forwardRef(() => AccessModule),
				forwardRef(() => AdminModule),
				forwardRef(() => BlacklistChannelModule),
				forwardRef(() => ChannelModule)],
	controllers: [UserController],
	providers: [UserService, UserSubscriber],
	exports: [UserService]
})
export class UserModule {}
