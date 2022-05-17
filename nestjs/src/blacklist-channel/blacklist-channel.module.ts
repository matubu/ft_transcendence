import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from 'src/app.module';
import { ChannelModule } from 'src/channel/channel.module';
import { UserModule } from 'src/user/user.module';
import { BlacklistChannel } from './blacklist-channel.entity';
import { BlacklistChannelService } from './blacklist-channel.service';
import { BlacklistSubscriber } from './blacklist-channel.subscriber'

@Module({
	imports: [TypeOrmModule.forFeature([BlacklistChannel]),
				forwardRef(() => UserModule),
				forwardRef(() => ChannelModule),
				forwardRef(() => AppModule)],
  	providers: [BlacklistChannelService, BlacklistSubscriber],
	exports: [BlacklistChannelService]
})
export class BlacklistChannelModule {}
