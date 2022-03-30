import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './User'
import { Channel } from './Channel'

@Entity()
export class Access
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
