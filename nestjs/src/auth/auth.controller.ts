import { Controller, Get, Query, Header, Res, Headers} from '@nestjs/common';
import { AuthService } from './auth.service'
import { UsersService } from 'src/users/users.service';
import { UsersInterface } from 'src/users/interfaces/users.interface';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService,
				private readonly usersService: UsersService) {}

	@Get()
	@Header('Content-Type', 'text/html')
	async setCookies(@Query() query: any[], @Res({ passthrough: true }) response, @Headers() headers)
	{
		const token = await this.authService.codeToToken(query['code'], headers.host);
		if (token['access_token'] !== undefined)
		{
			const info = await this.authService.getInfo(token['access_token']);
			if (info['id'] !== undefined)
			{
				const users_value = await this.usersService.findOne(info['id'].toString());
				if (users_value === undefined)
				{
					const createUser: UsersInterface = {
						id: info['id'],
						fullname: info['displayname'],
						twoauth: false,
						img: info['image_url'],
						elo: 1000
					};
					await this.usersService.insert(createUser);
					response.setCookie('first_conn', "true",
									{
										path: '/',
										signed: true
									});
					response.setCookie('user', info['id'].toStrign(),
									{
										path: '/',
										signed: true
									});
				}
				else
				{
					const user = await this.usersService.findOne(info['id']);
					if (user.twoauth)
						response.setCookie('user', user.twoauth ? "" : info['id'].toStrign(),
						{
							path: '/',
							signed: true
						});
				}
				response.setCookie('userid', info['id'].toString(),
									{
										path: '/',
										signed: true
									});
			}
		}
		return ('<script>window.close()</script>');
	}
}
