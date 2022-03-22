import { Controller, Get, Session } from '@nestjs/common';
import { AppService } from './app.service';
import * as secureSession from 'fastify-secure-session'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Session() session: secureSession.Session): string {
    return this.appService.getHello(session);
  }
}
