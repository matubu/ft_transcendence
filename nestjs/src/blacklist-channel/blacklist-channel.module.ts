import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelModule } from 'src/channel/channel.module';
import { UserModule } from 'src/user/user.module';
import { BlacklistChannel } from './blacklist-channel.entity';
import { BlacklistChannelService } from './blacklist-channel.service';

@Module({
	imports: [TypeOrmModule.forFeature([BlacklistChannel]),
				forwardRef(() => UserModule),
				forwardRef(() => ChannelModule)],
  	providers: [BlacklistChannelService],
	exports: [BlacklistChannelService]
})
export class BlacklistChannelModule {}
