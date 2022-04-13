import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity'
import { Channel } from '../channel/channel.entity'

@Entity()
export class Message
{
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User)
	@JoinColumn({ name: "userId"})
    user: User;

	@Column()
	userId: number;

	@ManyToOne(() => Channel)
    channel: Channel;

	@Column()
	msg: string;
}
