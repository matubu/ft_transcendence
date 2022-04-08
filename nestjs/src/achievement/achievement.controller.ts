import { Controller, Get } from '@nestjs/common';
import { AchievementService } from './achievement.service';

@Controller('achievement')
export class AchievementController {
	constructor(private readonly achievementService: AchievementService) {}

	@Get()
	async getAll()
	{
		return await this.achievementService.getAchievements();
	}
}
