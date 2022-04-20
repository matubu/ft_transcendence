import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity'

@Entity()
export class Block
{
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User)
    user: User;

	@ManyToOne(() => User)
	@JoinColumn({ name: 'blockedId' })
    blocked: User;

	@Column()
	blockedId: number;
}