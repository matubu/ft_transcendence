import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import fastifyCookie from 'fastify-cookie'
import fastifyMultipart from 'fastify-multipart'
import { WsAdapter } from './ws-adapter'

const { NESTJS_PORT, SECRET_COOKIES } = process.env

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter(),
	)
	app.setGlobalPrefix('api')
	app.register(fastifyCookie, { secret: SECRET_COOKIES })
	app.register(fastifyMultipart)
	app.useWebSocketAdapter(new WsAdapter())
	await app.listen(NESTJS_PORT)
	console.log(`Application is running on: ${await app.getUrl()}`)
}
  
bootstrap()
