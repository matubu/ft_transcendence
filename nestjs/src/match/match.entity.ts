import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../user/user.entity'

@Entity()
export class Match
{
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToMany(() => User, user => user.id)
	players: User[];

	@ManyToOne(() => User, { eager : true })
	player1?: User;

	@ManyToOne(() => User, { eager : true })
	player2?: User;

	@Column({ default: 0 })
	player1_score: number;

	@Column({ default: 0 })
	player2_score: number;

	@ManyToOne(() => User, { eager : true })
	victory?: User;
}
