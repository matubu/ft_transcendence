import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { User } from '../user/user.entity'
import { Channel } from '../channel/channel.entity'

@Entity()
export class BlacklistChannel
{
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User)
    user: User;

	@ManyToOne(() => Channel, { eager : true })
    channel: Channel;

	@Column({ nullable: true })
	date?: Date;
}
