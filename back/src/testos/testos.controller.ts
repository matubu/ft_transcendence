import { Controller, Get, Param } from '@nestjs/common';
import { TestosService } from './testos.service';
import { Testos } from './entity/testos.entity';

@Controller('testos')
export class TestosController {
	constructor(private readonly testosService: TestosService) {}
	@Get()
	getAll() : Promise<Testos[]>
	{ return this.testosService.findAll(); }

	@Get('insert')
	insert()
	{ return this.testosService.insert(); }

	@Get(':id')
	getOne(@Param('id') id: string) : Promise<Testos>
	{ return this.testosService.findOne(id); }
}
