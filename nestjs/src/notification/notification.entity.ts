import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity'

@Entity()
export class Notification
{
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, user => user.notifications)
    receiver: User;

	@Column()
	msg: boolean

	@OneToOne(() => User)
    @JoinColumn()
    sender?: User;

	@Column({ default: false })
	seen?: boolean
}
