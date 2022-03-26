import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import fastifyCookie from 'fastify-cookie';

const { NESTJS_PORT, SECRET_COOKIES } = process.env

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter(),
	  );
	app.setGlobalPrefix('api');
	const port = NESTJS_PORT;
	const secret = SECRET_COOKIES;
	app.register(fastifyCookie, {
		secret: `${secret}`
	});
	await app.listen(port, () => console.log(`Server started on http://localhost:${port}`));
  }
  
bootstrap();
