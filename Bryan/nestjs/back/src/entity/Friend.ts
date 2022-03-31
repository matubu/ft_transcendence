import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { User } from './User'

@Entity()
export class Friend
{
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, user => user.friends)
    user: User;

	@OneToOne(() => User)
    @JoinColumn()
    friend: User;
}
