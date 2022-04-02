import { Injectable } from '@nestjs/common'
import { Token } from './interfaces/token.interface'
import { Error } from './interfaces/error.interface'
import { Users42 } from './interfaces/users42.interface'
const axios = require('axios')

@Injectable()
export class AuthService {
	// https://api.intra.42.fr/apidoc/guides/web_application_flow
	async codeToToken(code: string, host: string): Promise<Token | Error>
	{
		const url = "https://api.intra.42.fr/oauth/token";
		const data = {
			"grant_type": "authorization_code",
			"client_id": process.env.CLIENT_ID,
			"client_secret": process.env.CLIENT_SECRET,
			"code": code,
			"redirect_uri": `http://${host}/api/auth`
		}

		return axios.post(url, data)
			.then(res => res['data'])
			.catch(error => error['response']['data'])
	}

	async getInfo(token: string) : Promise<Users42 | Error>
	{
		const url = "https://api.intra.42.fr/v2/me";
		const data = { headers: { Authorization: `Bearer ${token}` } }

		return axios.get(url, data)
			.then(res => res['data'])
			.catch(error => error['response']['data'])
	}

	async setCookie(response: any, key: string, param: string): Promise<void>
	{
		response.setCookie(key, param,
		{
			sameSite: 'Strict',
			path: '/',
			signed: true
		});
	}
}
