import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DfaModule } from 'src/dfa/dfa.module';
import { PictureModule } from 'src/picture/picture.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserSubscriber } from './user.subscriber';
import { AlcoholModule } from 'src/alcohol/alcohol.module';

@Module({
	imports: [TypeOrmModule.forFeature([User]),
				DfaModule,
				PictureModule,
				forwardRef(() => AuthModule),
				AlcoholModule],
	controllers: [UserController],
	providers: [UserService, UserSubscriber],
	exports: [UserService]
})
export class UserModule {}
