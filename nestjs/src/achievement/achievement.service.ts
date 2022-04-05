import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Achievement } from './achievement.entity';

@Injectable()
export class AchievementService {
	constructor(
		@InjectRepository(Achievement)
		private achievementRepository: Repository<Achievement>
	) {}

	async findAll(): Promise<Achievement[]>
	{
		return this.achievementRepository.find();
	}
}
