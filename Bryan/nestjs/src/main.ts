import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import fastifyCookie from 'fastify-cookie';
import fastifyMultipart from 'fastify-multipart';
const fs = require('fs')

const { NESTJS_PORT, SECRET_COOKIES } = process.env

async function bootstrap()
{
	const httpsOptions = {
		key: fs.readFileSync('./key.pem'),
		cert: fs.readFileSync('./cert.pem'),
	};

	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter( false ? { https: httpsOptions } : {}),
	);

	app.setGlobalPrefix('api');
	app.register(fastifyMultipart);
	app.register(fastifyCookie, { secret: SECRET_COOKIES });
	await app.listen(NESTJS_PORT);
	console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
