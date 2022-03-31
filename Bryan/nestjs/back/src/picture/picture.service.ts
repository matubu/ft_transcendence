import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Picture } from './picture.entity'

@Injectable()
export class PictureService {
	constructor(
		@InjectRepository(Picture)
		private pictureRepository: Repository<Picture>
	) {}
}
