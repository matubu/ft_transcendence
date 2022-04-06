import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn, JoinTable } from 'typeorm';
import { User } from '../user/user.entity'

@Entity()
export class Friend
{
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, user => user.friends)
    user: User;

	@OneToOne(() => User, { eager : true })
    @JoinColumn()
    friend: User;
}
