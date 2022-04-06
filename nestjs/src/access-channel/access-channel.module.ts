import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelModule } from 'src/channel/channel.module';
import { UserModule } from 'src/user/user.module';
import { AccessChannel } from './access-channel.entity';
import { AccessChannelService } from './access-channel.service';

@Module({
	imports: [TypeOrmModule.forFeature([AccessChannel]),
					forwardRef(() => UserModule),
					forwardRef(() => ChannelModule)],
	providers: [AccessChannelService],
	exports: [AccessChannelService]
})
export class AccessModule {}
