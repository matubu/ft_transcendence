import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelModule } from 'src/channel/channel.module';
import { UserModule } from 'src/user/user.module';
import { AdminChannel } from './admin-channel.entity';
import { AdminChannelService } from './admin-channel.service';

@Module({
	imports: [TypeOrmModule.forFeature([AdminChannel]),
					forwardRef(() => UserModule),
					forwardRef(() => ChannelModule)],
	providers: [AdminChannelService],
	exports: [AdminChannelService]
})
export class AdminModule {}
