import { forwardRef, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { PictureModule } from './picture/picture.module';
import { NotificationModule } from './notification/notification.module';
import { MessageModule } from './message/message.module';
import { MatchModule } from './match/match.module';
import { ChannelModule } from './channel/channel.module';
import { AccessModule } from './access-channel/access-channel.module';
import { FriendModule } from './friend/friend.module';
import { DfaModule } from './dfa/dfa.module';
import { AuthModule } from './auth/auth.module';
import { AchievementModule } from './achievement/achievement.module';
import { AppGateway } from './app.gateway';
import { AdminModule } from './admin-channel/admin-channel.module';
import { UserAchievementModule } from './user-achievement/user-achievement.module';
import { AlcoholModule } from './alcohol/alcohol.module';
import { RankModule } from './rank/rank.module';
import { SearchModule } from './search/search.module';
import { BlacklistChannelModule } from './blacklist-channel/blacklist-channel.module';
import { BlockModule } from './block/block.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [TypeOrmModule.forRoot(), UserModule, PictureModule, NotificationModule, MessageModule, MatchModule, forwardRef(() => ChannelModule), AccessModule, FriendModule, DfaModule, AuthModule, AchievementModule, AdminModule, UserAchievementModule, AlcoholModule, RankModule, SearchModule, BlacklistChannelModule, BlockModule, ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, AppGateway],
  exports: [AppGateway]
})
export class AppModule {}
