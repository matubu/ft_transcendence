import { Entity, PrimaryGeneratedColumn, OneToOne, Column, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity'

@Entity()
export class Match
{
	@PrimaryGeneratedColumn()
	id: number;

	@OneToOne(() => User)
    @JoinColumn()
    player1: User;

	@OneToOne(() => User)
    @JoinColumn()
    player2: User;

	@Column()
	player1_score: number;

	@Column()
	player2_score: number;

	@OneToOne(() => User)
    @JoinColumn()
    victory?: User;
}
