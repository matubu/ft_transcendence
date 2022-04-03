import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { PictureModule } from './picture/picture.module';
import { NotificationModule } from './notification/notification.module';
import { MessageModule } from './message/message.module';
import { MatchModule } from './match/match.module';
import { ChannelModule } from './channel/channel.module';
import { AccessModule } from './access/access.module';
import { FriendModule } from './friend/friend.module';
import { DfaModule } from './dfa/dfa.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [TypeOrmModule.forRoot(), UserModule, PictureModule, NotificationModule, MessageModule, MatchModule, ChannelModule, AccessModule, FriendModule, DfaModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
