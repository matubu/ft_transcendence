import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RankModule } from './rank/rank.module';
import { MatchsModule } from './matchs/matchs.module';
import { MessagesModule } from './messages/messages.module';
import { ChannelsModule } from './channels/channels.module';
import { AppGateway } from './app.gateway';
import { ImagesModule } from './images/images.module';
import { UsersSubscriber } from './users/entity/users.subscriber';
import { Users } from './users/entity/users.entity';

@Module({
  imports: [UsersModule,
			AuthModule,
			TypeOrmModule.forRoot({subscribers: [UsersSubscriber], entities: [Users]}),
			RankModule,
			MatchsModule,
			MessagesModule,
			ChannelsModule,
			ImagesModule],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
