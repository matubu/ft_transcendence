import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Dfa } from "../dfa/dfa.entity";
import { Picture } from "../picture/picture.entity";
import { Friend } from "../friend/friend.entity";
import { Channel } from "../channel/channel.entity";
import { AccessChannel } from "../access-channel/access-channel.entity";
import { Notification } from "../notification/notification.entity";
import { AdminChannel } from 'src/admin-channel/admin-channel.entity';
import { UserAchievement } from 'src/user-achievement/user-achievement.entity';
import { Match } from 'src/match/match.entity';
import { Block } from 'src/block/block.entity';

@Entity()
export class User
{
	@PrimaryColumn({ unique: true })
	id: number;

	@Column()
	fullname: string;

	@Column({ default: 1000 })
	elo: number;

	@Column({ unique: true, default: null })
	nickname?: string;

	@OneToOne(() => Picture, { eager : true })
	@JoinColumn()
	picture: Picture;

	@OneToOne(() => Dfa)
	@JoinColumn()
	dfa?: Dfa;

	@OneToMany(() => Friend, friend => friend.user)
	friends?: Friend[];

	@OneToMany(() => Channel, channel => channel.owner)
	ownerChannels?: Channel[];

	@OneToMany(() => AdminChannel, adminChannel => adminChannel.user)
	adminChannels?: AdminChannel[];

	@OneToMany(() => AccessChannel, accessChannel => accessChannel.user)
	accessChannels?: AccessChannel[];

	@OneToMany(() => Notification, notification => notification.receiver)
	notifications?: Notification[];

	@OneToMany(() => UserAchievement, userAchievement => userAchievement.user)
	achievements?: UserAchievement[];

	@ManyToMany(() => Match, match => match.players)
	@JoinTable()
	matchs: Match[];

	@OneToMany(() => Block, block => block.user)
	blockList: Block[];
}
