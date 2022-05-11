import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { Notification } from './notification.entity';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { NotificationSubscriber } from './notification.subscriber';
import { AppModule } from 'src/app.module';

@Module({
	imports: [TypeOrmModule.forFeature([Notification]),
				forwardRef(() => UserModule),
				forwardRef(() => AppModule)],
	providers: [NotificationService, NotificationSubscriber],
	exports: [NotificationService],
	controllers: [NotificationController]
})
export class NotificationModule {}
