import sirv from 'sirv'
import polka from 'polka'
var https = require('https')
var fs = require('fs');
import * as sapper from '@sapper/server'
import { createProxyMiddleware } from 'http-proxy-middleware'
import { getCookieFromString } from '@lib/utils'

const { NODE_ENV, SAPPER_PORT, NESTJS_PORT } = process.env
const dev = NODE_ENV === 'development'

const privateKey  = fs.readFileSync('key.pem', 'utf8');
const certificate = fs.readFileSync('cert.pem', 'utf8');

const credentials = { key: privateKey, cert: certificate };

https.createServer(credentials, polka()
	.use(
		'/api',
		createProxyMiddleware({
			target: `http://NestJS:${NESTJS_PORT}`,
			secure: false,
			changeOrigin: false
		})
	)
	.use(
		sirv('static', { dev }),
		sapper.middleware({
			ignore: '/api',
			session: (req, res) => ({ user: getCookieFromString(req.headers['cookie'], 'user') })
		})
	))
	.listen(SAPPER_PORT)