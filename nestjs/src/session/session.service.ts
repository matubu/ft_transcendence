import { Injectable, Session } from '@nestjs/common';
import * as secureSession from 'fastify-secure-session'
import { Session_interface } from './interfaces/session.interface';

@Injectable()
export class SessionService {
	getAll(@Session() session: secureSession.Session) : Session_interface
	{
		const data: Session_interface = {
			token: session['token'],
			id: session['id'],
			real_name: session['real_name'],
			display_name: session['display_name']
		}
		console.log(data);
		return (data);
	}

	getToken(key:string, @Session() session: secureSession.Session) : any
	{ return ( session["token"]); }

	Destroy(@Session() session: secureSession.Session) : boolean
	{
		// todos
		return (false);
	}
}
