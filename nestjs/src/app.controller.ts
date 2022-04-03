import { Controller, Get, Res } from '@nestjs/common'
import { AppService } from './app.service'
import { Autorization } from './auth.guard';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}
}
