import { Controller, Get, Header, Param, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
const fs = require("fs"); 

@Controller('images')
export class ImagesController {
	@Get(':image_name')
	@Header('Content-Type', 'image/jpg')
	getImage(@Param('image_name') image_name: string): StreamableFile
	{
		const path = join(process.cwd() + "/upload/images/", image_name)
		if (image_name.length <= 0 || !fs.existsSync(path))
			return ;
		const file = createReadStream(path);
		return new StreamableFile(file);
	}
}
