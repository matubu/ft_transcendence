import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { Notification } from './notification.entity';
import { NotificationService } from './notification.service';

@Module({
	imports: [TypeOrmModule.forFeature([Notification]),
				forwardRef(() =>UserModule)],
	providers: [NotificationService],
	exports: [NotificationService]
})
export class NotificationModule {}
