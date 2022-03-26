import { Injectable } from '@nestjs/common';
import { Token } from './interfaces/token.interface';
import { Error } from './interfaces/error.interface';
import { Users42 } from './interfaces/users42.interface';
const axios = require('axios');

@Injectable()
export class AuthService {
	// https://api.intra.42.fr/apidoc/guides/web_application_flow
	codeToToken(code: string): Promise<Token | Error>
	{
		const url = "https://api.intra.42.fr/oauth/token";
		const data = {
			"grant_type": "authorization_code",
			"client_id": process.env.CLIENT_ID,
			"client_secret": process.env.CLIENT_SECRET,
			"code": code,
			"redirect_uri": "http://localhost:3000/api/auth"
		}

		return axios.post(url, data)
		.then(res => {
			// console.log(res['data'])
			return res['data']
		})
		.catch(error => {
			// console.error(error['response']['data'])
			return error['response']['data']
		})
	}

	getInfo(token: string) : Promise<Users42 | Error>
	{
		const url = "https://api.intra.42.fr/v2/me";
		const data = { headers: { Authorization: `Bearer ${token}` } }

		return axios.get(url, data)
		.then(res => {
			// console.log(res['data'])
			return res['data']
		})
		.catch(error => {
			// console.error(error['response']['data'])
			return error['response']['data']
		})
	}
}
