import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import secureSession from 'fastify-secure-session';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter(),
	  );
	  app.register(secureSession, {
		secret: 'averylogphrasebiggerthanthirtytwochars',
		salt: 'mq9hDxBVDbspDR6n',
	  });
	const port = 3000;
	app.enableCors({
		origin: "http://localhost:8080",
		credentials: true,
	});
	await app.listen(port, () => console.log(`Server started on http://localhost:${port}`));
  }
  
bootstrap();
