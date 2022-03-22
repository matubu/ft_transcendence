import { Controller, Get, Session, Request } from '@nestjs/common';
import { AppService } from './app.service';
import * as secureSession from 'fastify-secure-session'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Request() a, @Session() session: secureSession.Session): string {
	console.log(a["raw"]['rawHeaders']);
	console.log("\n\n\n\\");
    return this.appService.getHello(session);
  }
}
