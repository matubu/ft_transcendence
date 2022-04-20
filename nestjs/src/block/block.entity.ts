import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity'

@Entity()
export class Block
{
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User)
    user: User;

	@ManyToOne(() => User, { eager: true })
    blocked: User;
}
