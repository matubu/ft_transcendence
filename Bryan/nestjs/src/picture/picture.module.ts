import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Picture } from './picture.entity';
import { PictureService } from './picture.service';
import { PictureController } from './picture.controller';

@Module({
	imports: [TypeOrmModule.forFeature([Picture])],
	providers: [PictureService],
	controllers: [PictureController]
})
export class PictureModule {}
