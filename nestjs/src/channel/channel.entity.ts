import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity'

@Entity()
export class Channel
{
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@ManyToOne(() => User, { eager : true })
	owner: User;

	@Column({ default: null })
	name?: string;

	@Column({ default: false })
	password_is_set: boolean

	@Column({ default: null })
	password?: string;

	@Column({ default: null })
	description?: string;

	@Column({ default: false })
	private: boolean;
}
