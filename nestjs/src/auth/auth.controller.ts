import { Controller, Get, Header, Query, Res, Headers } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService,
				private readonly userService: UserService) {}

	@Get()
	@Header('Content-Type', 'text/html')
	async setCookies(@Query() query: any[], @Res({ passthrough: true }) response, @Headers() headers): Promise<string>
	{
		const token = await this.authService.codeToToken(query['code'], headers.host);
		if (token['access_token'] !== undefined)
		{
			const info = await this.authService.getInfo(token['access_token']);
			if (info['id'] !== undefined)
			{
				const user = await this.userService.get(info['id'], []);
				if (user !== undefined)
					this.authService.setCookie(response, "user", user.twoauth ? '' : info['id'].toString());
				else
				{
					await this.userService.create(info['id'], info['displayname'], info['image_url']);
					this.authService.setCookie(response, "first_conn", "true");
					this.authService.setCookie(response, "user", info['id'].toString());
				}
				this.authService.setCookie(response, "userid", info['id'].toString());
			}
		}
		return ('<script>window.close()</script>');
	}
}
