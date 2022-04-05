import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Dfa } from "../dfa/dfa.entity";
import { Picture } from "../picture/picture.entity";
import { Friend } from "../friend/friend.entity";
import { Channel } from "../channel/channel.entity";
import { Access } from "../access/access.entity";
import { Notification } from "../notification/notification.entity";
import { Admin } from 'src/admin/admin.entity';

@Entity()
export class User
{
	@PrimaryColumn({ unique: true })
	id: number;

	@Column()
	fullname: string;

	@Column({ default: false })
	twoauth: boolean;

	@Column({ default: 1000 })
	elo: number;

	@Column({ unique: true, default: null })
	nickname?: string;

	@OneToOne(() => Picture)
    @JoinColumn()
    picture: Picture;

	@OneToOne(() => Dfa)
    @JoinColumn()
    dfa?: Dfa;

	@OneToMany(() => Friend, friend => friend.user)
    friends?: Friend[];

	@OneToMany(() => Channel, channel => channel.owner)
    ownerChannels?: Channel[];

	@OneToMany(() => Admin, admin => admin.user)
    adminChannels?: Admin[];

	@OneToMany(() => Access, access => access.user)
    accessChannels?: Access[];

	@OneToMany(() => Notification, notification => notification.receiver)
    notifications?: Notification[];
}
