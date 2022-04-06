import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from './channel.entity';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';
import { AdminModule } from 'src/admin-channel/admin-channel.module';
import { AccessModule } from 'src/access-channel/access-channel.module';
import { UserModule } from 'src/user/user.module';
import { MessageModule } from 'src/message/message.module';

@Module({
	imports: [TypeOrmModule.forFeature([Channel]),
				forwardRef(() => AdminModule),
				forwardRef(() => AccessModule),
				forwardRef(() => UserModule),
				forwardRef(() => MessageModule)],
	controllers: [ChannelController],
	providers: [ChannelService],
	exports: [ChannelService]
})
export class ChannelModule {}
