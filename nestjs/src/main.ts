import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import fastifyCookie from 'fastify-cookie';

const { NESTJS_PORT } = process.env

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter(),
	  );
	app.setGlobalPrefix('api');
	const port = NESTJS_PORT;
	app.enableCors({
		origin: "http://localhost",
		credentials: true,
	});
	app.register(fastifyCookie);
	await app.listen(port, () => console.log(`Server started on http://localhost:${port}`));
  }
  
bootstrap();
