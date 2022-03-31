import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Picture } from './picture.entity';
import { PictureService } from './picture.service';

@Module({
	imports: [TypeOrmModule.forFeature([Picture])],
	providers: [PictureService]
})
export class PictureModule {}
