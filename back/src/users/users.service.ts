import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
	all():string {
		return "ALL";
	}

	id(id: string):string {
		return "id : " + id;
	}
}
