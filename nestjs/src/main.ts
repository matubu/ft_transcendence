import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import fastifyCookie from 'fastify-cookie';
import fastifyMultipart from 'fastify-multipart';
import { WsAdapter } from '@nestjs/platform-ws'

const { NESTJS_PORT, SECRET_COOKIES } = process.env

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter(),
	);
	app.setGlobalPrefix('api');
	const port = NESTJS_PORT;
	const secret = SECRET_COOKIES;
	app.register(fastifyCookie, { secret });
	app.register(fastifyMultipart)
	app.useWebSocketAdapter(new WsAdapter(app));
	await app.listen(port);
	console.log(`Application is running on: ${await app.getUrl()}`);
}
  
bootstrap();
