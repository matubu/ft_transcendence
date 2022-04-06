import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelModule } from 'src/channel/channel.module';
import { UserModule } from 'src/user/user.module';
import { Message } from './message.entity';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';

@Module({
	imports: [TypeOrmModule.forFeature([Message]),
				forwardRef(() => UserModule),
				forwardRef(() => ChannelModule)],
	providers: [MessageService],
	exports: [MessageService],
	controllers: [MessageController]
})
export class MessageModule {}
