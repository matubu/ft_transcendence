import { Controller, Get, Header, Param, StreamableFile, HttpException, HttpStatus } from '@nestjs/common';
import { createReadStream } from 'fs';
import { PictureService } from './picture.service';
const fs = require("fs");

@Controller('picture')
export class PictureController {
	constructor(private readonly pictureService: PictureService) {}

	@Get(':image_name')
	@Header('Content-Type', 'image/jpg')
	async getImage(@Param('image_name') image_name: string): Promise<StreamableFile>
	{
		const image = await this.pictureService.search(image_name);
		if (image === undefined)
			throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
		const file = createReadStream(process.cwd() + "/upload/images/" + image.name);
		return new StreamableFile(file);
	}
}
