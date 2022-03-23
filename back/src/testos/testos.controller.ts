import { Controller, Get } from '@nestjs/common';
import { TestosService } from './testos.service';

@Controller('testos')
export class TestosController {
	constructor(private readonly testosService: TestosService) {}
	@Get()
	getAll() : any
	{ return this.testosService.test(); }
}
