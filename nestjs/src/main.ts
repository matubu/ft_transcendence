import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import fastifyCookie from '@fastify/cookie'
import fastifyMultipart from '@fastify/multipart'
import { WsAdapter } from './ws-adapter'
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
	app.register(fastifyCookie, { secret: SECRET_COOKIES });
	app.register(fastifyMultipart);
	app.useWebSocketAdapter(new WsAdapter())
	await app.listen(NESTJS_PORT, "0.0.0.0");
	console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
