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

@Module({
  imports: [UsersModule,
			AuthModule,
			TypeOrmModule.forRoot(),
			RankModule,
			MatchsModule,
			MessagesModule,
			ChannelsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
