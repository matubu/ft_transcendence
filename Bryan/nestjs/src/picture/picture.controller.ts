import { Controller, Get, Header, Param, StreamableFile, HttpException, HttpStatus, Post, Req } from '@nestjs/common';
import { createReadStream } from 'fs';
import { PictureService } from './picture.service';
const fs = require("fs");
import { FastifyRequest } from 'fastify'
import { Picture } from './picture.entity'

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

	@Get()
	async getAll(): Promise<Picture[]>
	{
		return await this.pictureService.view();
	}

	@Post()
	async uploadPicture(@Req() req: FastifyRequest): Promise<Picture>
	{
		const data = await req.file();
		const valid_mime: string[] = [ "image/gif", "image/jpeg", "image/png", "image/bmp", "image/tiff" ];
		const found = valid_mime.find(element => element == data.mimetype);
		if (found === data.mimetype)
			return await this.pictureService.insertByData(data.file);
		throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
	}
}
