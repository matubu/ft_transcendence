import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { MFA } from "./MFA";
import { Picture } from "./Picture";
import { Friend } from "./Friend";
import { Channel } from "./Channel";
import { Access } from "./Access";

@Entity()
export class User
{
	@PrimaryColumn()
	id: number;

	@Column()
	fullname: string;

	@Column({ default: null })
	nickname?: string;

	@Column({ default: false })
	twoauth: boolean;

	@Column({ default: 1000 })
	elo: number;

	@OneToOne(() => MFA)
    @JoinColumn()
    MFA?: MFA;

	@OneToOne(() => Picture)
    @JoinColumn()
    picture?: Picture;

	@OneToMany(() => Friend, friend => friend.user)
    friends: Friend[];

	@OneToMany(() => Channel, channel => channel.admin)
    adminChannels: Channel[];

	@OneToMany(() => Access, access => access.user)
    accessChannels: Access[];
}
