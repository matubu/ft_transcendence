import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity'
import { Achievement } from 'src/achievement/achievement.entity';

@Entity()
export class UserAchievement
{
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User)
	user: User;

	@ManyToOne(() => Achievement, { eager : true })
	achievement: Achievement;
}
