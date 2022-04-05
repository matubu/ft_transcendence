import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity'
import { Channel } from '../channel/channel.entity'

@Entity()
export class Admin
{
	@PrimaryGeneratedColumn()
	id: number;

	@OneToOne(() => User)
	@JoinColumn()
	user: User;

	@OneToOne(() => Channel)
	@JoinColumn()
	channel: Channel;
}
