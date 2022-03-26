import sirv from 'sirv'
import polka from 'polka'
import * as sapper from '@sapper/server'
import { createProxyMiddleware } from 'http-proxy-middleware';

const { NODE_ENV, SAPPER_PORT } = process.env
const dev = NODE_ENV === 'development'

const server = polka()

server
	.use(
		'/api',
		createProxyMiddleware({
			target: 'http://127.0.0.1:3000',
			changeOrigin: true
		})
	)
	.use(
		sirv('static', { dev }),
		sapper.middleware({ ignore: '/api' })
	)

server
	.listen(SAPPER_PORT)