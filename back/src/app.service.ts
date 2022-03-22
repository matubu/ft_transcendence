import { Injectable, Session } from '@nestjs/common';
import * as secureSession from 'fastify-secure-session'

@Injectable()
export class AppService {
  getHello(@Session() session: secureSession.Session): string {
    return "TOKEN : " + session.get('token');
  }
}
