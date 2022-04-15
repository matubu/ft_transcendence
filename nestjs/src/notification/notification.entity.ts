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
	msg: string

	@ManyToOne(() => User, { eager : true })
    sender?: User;

	@Column({ default: false })
	seen?: boolean

	@Column({ nullable: true })
	url?: string
}
