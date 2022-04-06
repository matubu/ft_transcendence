import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity'
import { Achievement } from 'src/achievement/achievement.entity';

@Entity()
export class UserAchievement
{
	@PrimaryGeneratedColumn()
	id: number;

	@OneToOne(() => User)
	@JoinColumn()
	user: User;

	@OneToOne(() => Achievement)
	@JoinColumn()
	achievement: Achievement;
}
