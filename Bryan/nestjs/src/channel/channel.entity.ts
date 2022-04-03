import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany, JoinTable } from 'typeorm';
import { User } from '../user/user.entity'
import { Message } from '../message/message.entity'

@Entity()
export class Channel
{
	@PrimaryGeneratedColumn()
	id: number;

	@OneToOne(() => User)
	@JoinColumn()
	owner: User;
	
	@OneToMany(() => User, user => user.id)
    admins: User[];

	@Column({ default: null })
	name?: string;

	@Column({ default: null })
	password?: string;

	@Column({ default: null })
	description?: string;

	@Column({ default: false })
	private: boolean;

	@OneToMany(() => Message, message => message.channel)
    messages?: Message[];
}
