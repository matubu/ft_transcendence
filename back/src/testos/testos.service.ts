import { Injectable } from '@nestjs/common';

@Injectable()
export class TestosService {
	test():string
	{
		return ("ALLO");
	}
}
