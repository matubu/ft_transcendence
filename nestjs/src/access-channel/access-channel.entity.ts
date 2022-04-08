import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity'
import { Channel } from '../channel/channel.entity'

@Entity()
export class AccessChannel
{
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User)
    user: User;

	@ManyToOne(() => Channel, { eager : true })
    channel: Channel;
}
