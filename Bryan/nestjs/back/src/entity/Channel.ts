import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './User'
import { Message } from './Message'

@Entity()
export class Channel
{
	@PrimaryGeneratedColumn()
	id: number;

	@OneToOne(() => User)
    @JoinColumn()
    admin: User;

	@Column({ default: null })
	name?: string;

	@Column({ default: null })
	password?: string;

	@Column({ default: null })
	description?: string;

	@Column({ default: false })
	private?: boolean;

	@OneToMany(() => Message, message => message.channel)
    messages?: Message[];
}
