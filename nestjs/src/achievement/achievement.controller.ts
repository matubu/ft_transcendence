import { Controller, Get } from '@nestjs/common';
import { Achievement } from './achievement.entity';
import { AchievementService } from './achievement.service'

@Controller('achievement')
export class AchievementController {
	constructor(private readonly achievementService: AchievementService) {}

	@Get()
	async findAll() : Promise<Achievement[]>
	{ return await this.achievementService.findAll(); }
}
