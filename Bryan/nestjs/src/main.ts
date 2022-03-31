import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const { NESTJS_PORT, SECRET_COOKIES } = process.env

async function bootstrap()
{
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  await app.listen(NESTJS_PORT);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
