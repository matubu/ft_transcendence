import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AchievementService } from 'src/achievement/achievement.service';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { UserAchievement } from './user-achievement.entity';

@Injectable()
export class UserAchievementService {
	constructor(
		@InjectRepository(UserAchievement)
		private userAchievementRepository: Repository<UserAchievement>,
		private readonly achievementService: AchievementService,
		@Inject(forwardRef(() => UserService))
		private readonly userService: UserService
	) {}

	async getAchievements(user: User): Promise<UserAchievement[]>
	{
		return this.userAchievementRepository.find({ where: { user: user } });
	}

	async insert(id_user: number, title_achievement: string): Promise<UserAchievement>
	{
		const exist = await this.achievementService.exist(title_achievement);
		if (exist == undefined)
			return undefined;
		const user = await this.userService.get(id_user, []);
		const userAchievements = await this.getAchievements(user);
		for (let i = 0; i < userAchievements.length; i++)
			if (userAchievements[i].achievement.title == title_achievement)
				return undefined;
		return this.userAchievementRepository.save({ achievement: exist, user: user });
	}
}
