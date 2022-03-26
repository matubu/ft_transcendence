import { Controller, Get, Req, Response } from '@nestjs/common';
import { AppService } from './app.service';
import { FastifyRequest } from 'fastify';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Req() req: FastifyRequest): string {
	console.log(req.unsignCookie(req.cookies.user));
    return this.appService.getHello();
  }
}
