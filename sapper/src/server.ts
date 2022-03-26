import sirv from 'sirv'
import polka from 'polka'
import * as sapper from '@sapper/server'
import { createProxyMiddleware } from 'http-proxy-middleware';

const { NODE_ENV, SAPPER_PORT, NESTJS_PORT } = process.env
const dev = NODE_ENV === 'development'

polka()
	.use(
		'/api',
		createProxyMiddleware({
			target: `http://127.0.0.1:${NESTJS_PORT}`,
			changeOrigin: true
		})
	)
	.use(
		sirv('static', { dev }),
		sapper.middleware({ ignore: '/api' })
	)
	.listen(SAPPER_PORT)