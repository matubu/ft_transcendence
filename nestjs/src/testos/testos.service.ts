import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Testos } from './entity/testos.entity';

@Injectable()
export class TestosService {
	constructor(
		@InjectRepository(Testos)
		private testosRepository: Repository<Testos>,
	) {}
	
	async insert()
	{
		const testos = new Testos();
		testos.name = "Abcde";
		testos.ok = true;
		await this.testosRepository.save(testos)
	}

	findAll(): Promise<Testos[]> {
		return this.testosRepository.find();
	}

	findOne(id: string): Promise<Testos> {
		return this.testosRepository.findOne(id);
	}

	// async remove(id: string): Promise<void> {
	// 	await this.testosRepository.delete(id);
	// }
}
