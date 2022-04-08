import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity'
import { Channel } from '../channel/channel.entity'

@Entity()
export class BlacklistChannel
{
	@PrimaryGeneratedColumn()
	id: number;

	@OneToOne(() => User)
    @JoinColumn()
    user: User;

	@OneToOne(() => Channel, { eager : true })
    @JoinColumn()
    channel: Channel;
}
