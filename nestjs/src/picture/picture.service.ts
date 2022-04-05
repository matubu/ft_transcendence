import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, DeleteResult } from 'typeorm'
import { Picture } from './picture.entity'
const download = require('image-downloader')
const md5 = require('md5')
const Jimp = require('jimp');
const fs = require('fs')
const { promisify } = require('util')
const { pipeline } = require('stream')
const pump = promisify(pipeline)

@Injectable()
export class PictureService {
	constructor(
		@InjectRepository(Picture)
		private pictureRepository: Repository<Picture>
	) {}

	async downloadImgByUrl(url_img: string): Promise<string>
	{
		const tmp_name = md5(Date.now());
		const tmp_folder = process.cwd() + "/upload/tmp/";
		const options = {
			url: url_img,
			dest: tmp_folder + tmp_name,
			extractFilename: false
		}

		return download.image(options)
				.then(({ filename }) => { return filename.substr(tmp_folder.length) })
				.catch((err) => console.error(err))
	}

	async convert(filename: string) : Promise<string>
	{
		const tmp_folder = process.cwd() + "/upload/tmp/";
		const img_name = md5(Date.now()) + ".jpg";

		return Jimp.read(tmp_folder + filename)
				.then(image =>
				{
					image
						.resize(256, Jimp.AUTO)
						.quality(60)
						.write(process.cwd() + "/upload/images/" + img_name);
					fs.unlinkSync(tmp_folder + filename);
					return (img_name);
				})
				.catch((err) => console.error(err))
	}

	async insert(name: string): Promise<Picture>
	{
		return this.pictureRepository.save({name: name, url: `/api/picture/${name}`});
	}

	async insertByURL(url: string): Promise<Picture>
	{
		const tmp_name = await this.downloadImgByUrl(url);
		const final_name = await this.convert(tmp_name);
		return this.insert(final_name);
	}

	async insertByData(file: any): Promise<Picture>
	{
		const tmp_name = md5(Date.now());
		await pump(file, fs.createWriteStream(process.cwd() + "/upload/tmp/" + tmp_name));
		const filename = await this.convert(tmp_name);
		return this.insert(filename);
	}

	async search(name: string): Promise<Picture>
	{
		return this.pictureRepository.findOne({where: {name: name}});
	}

	async removeByName(name: string): Promise<DeleteResult>
	{
		fs.unlinkSync(process.cwd() + "/upload/images/" + name);
		return this.pictureRepository.delete({ name: name });
	}

	async removeByID(id: number): Promise<DeleteResult>
	{
		const image = await this.pictureRepository.findOne({where: {id: id}})
		return this.removeByName(image.name);
	}
}
