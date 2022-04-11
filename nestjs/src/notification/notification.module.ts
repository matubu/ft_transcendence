import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { Notification } from './notification.entity';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';

@Module({
	imports: [TypeOrmModule.forFeature([Notification]),
				forwardRef(() =>UserModule)],
	providers: [NotificationService],
	exports: [NotificationService],
	controllers: [NotificationController]
})
export class NotificationModule {}
