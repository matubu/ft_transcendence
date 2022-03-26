import { Controller, Get, Query, Header, Res} from '@nestjs/common';
import { AuthService } from './auth.service'
import { UsersService } from 'src/users/users.service';
import { UsersInterface } from 'src/users/interfaces/users.interface';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService,
				private readonly usersService: UsersService) {}

	@Get()
	@Header('Content-Type', 'text/html')
	async setCookies(@Query() query: any[], @Res({ passthrough: true }) response)
	{
		const token = await this.authService.codeToToken(query['code']);
		if (token['access_token'] !== undefined)
		{
			const info = await this.authService.getInfo(token['access_token']);
			if (info['id'] !== undefined)
			{
				const users_value = await this.usersService.findOne(info['id'].toString());
				let data = {};
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
					data = createUser
					data['first_conn'] = true;
				}
				else
				{
					data = await this.usersService.findOne(info['id']);
					data['first_conn'] = false;
				}
				data['id'] = info['id'];
				response.setCookie('user', JSON.stringify(data), { path: '/' } );
			}
		}
		return ('<script>window.close()</script>');
	}
}
