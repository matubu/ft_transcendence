import sirv from 'sirv'
import polka from 'polka'
import * as sapper from '@sapper/server'
import { createProxyMiddleware } from 'http-proxy-middleware';
import { getCookieFromString } from '@lib/utils'

const { NODE_ENV, SAPPER_PORT, NESTJS_PORT } = process.env
const dev = NODE_ENV === 'development'

polka()
	.use(
		'/api',
		createProxyMiddleware({
			target: `http://127.0.0.1:${NESTJS_PORT}`
		})
	)
	.use(
		sirv('static', { dev }),
		sapper.middleware({
			ignore: '/api',
			session: (req, res) => ({ user: getCookieFromString(req.headers['cookie'], 'user') })
		})
	)
	.listen(SAPPER_PORT)