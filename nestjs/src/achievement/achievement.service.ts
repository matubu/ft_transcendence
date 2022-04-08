import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Achievement } from './achievement.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AchievementService {
	constructor(
		@InjectRepository(Achievement)
		private achievementRepository: Repository<Achievement>
	) {}

	async getAchievements(): Promise<Achievement[]>
	{
		return this.achievementRepository.find();
	}

	async exist(title: string): Promise<Achievement>
	{
		return this.achievementRepository.findOne({ where: {title: title} });
	}
}
