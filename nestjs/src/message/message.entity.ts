import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity'
import { Channel } from '../channel/channel.entity'

@Entity()
export class Message
{
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, { eager : true })
    user: User;

	@ManyToOne(() => Channel)
    channel: Channel;

	@Column()
	msg: string;
}
