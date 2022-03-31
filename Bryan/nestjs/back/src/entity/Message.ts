import { Entity, PrimaryGeneratedColumn, OneToOne, Column, JoinColumn } from 'typeorm';
import { User } from './User'
import { Channel } from './Channel'

@Entity()
export class Message
{
	@PrimaryGeneratedColumn()
	id: number;

	@OneToOne(() => User)
    @JoinColumn()
    user: User;

	@OneToOne(() => Channel)
    @JoinColumn()
    channel: Channel;

	@Column()
	msg: string;
}
