import { Injectable } from '@nestjs/common';
import { Token } from './interfaces/token.interface';
import { Error } from './interfaces/error.interface';
import ENV = require('../env.json');
const axios = require('axios');

@Injectable()
export class AuthService {
	// https://api.intra.42.fr/apidoc/guides/web_application_flow
	codeToToken(code: string): Token | Error
	{
		const url = "https://api.intra.42.fr/oauth/token";
		const data = {
			"grant_type": "authorization_code",
			"client_id": ENV['CLIENT_ID'],
			"client_secret": ENV['CLIENT_SECRET'],
			"code": code,
			"redirect_uri": "http://localhost:3000/auth"
		}

		return (
			axios.post(url, data)
			.then(res => {
				console.log(res['data'])
				return res['data']
			})
			.catch(error => {
				console.error(error['response']['data'])
				return error['response']['data']
			})
		);
	}
}
