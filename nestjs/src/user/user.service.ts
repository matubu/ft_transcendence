import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { DeleteResult, ILike, Repository } from 'typeorm'
import { User } from './user.entity'
import { Dfa } from 'src/dfa/dfa.entity'
import { DfaService } from 'src/dfa/dfa.service';
import { Picture } from 'src/picture/picture.entity';
import { PictureService } from 'src/picture/picture.service';
import { NotificationService } from 'src/notification/notification.service';
import { UserAchievementService } from 'src/user-achievement/user-achievement.service';
import { FriendService } from 'src/friend/friend.service';
import { MatchService } from 'src/match/match.service';
import { MessageService } from 'src/message/message.service';
import { BlockService } from 'src/block/block.service';
import { AccessChannelService } from 'src/access-channel/access-channel.service';
import { AdminChannelService } from 'src/admin-channel/admin-channel.service';
import { BlacklistChannelService } from 'src/blacklist-channel/blacklist-channel.service';
import { ChannelService } from 'src/channel/channel.service';
const fs = require('fs')

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
		private readonly dfaService: DfaService,
		private readonly pictureService: PictureService,
		@Inject(forwardRef(() => NotificationService))
		private readonly notificationService: NotificationService,
		@Inject(forwardRef(() => UserAchievementService))
		private readonly userAchievementService: UserAchievementService,
		@Inject(forwardRef(() => FriendService))
		private readonly friendService: FriendService,
		@Inject(forwardRef(() => MatchService))
		private readonly matchService: MatchService,
		@Inject(forwardRef(() => MessageService))
		private readonly messageService: MessageService,
		@Inject(forwardRef(() => BlockService))
		private readonly blockService: BlockService,
		@Inject(forwardRef(() => AccessChannelService))
		private readonly accessChannel: AccessChannelService,
		@Inject(forwardRef(() => AdminChannelService))
		private readonly adminChannel: AdminChannelService,
		@Inject(forwardRef(() => BlacklistChannelService))
		private readonly blackListChannelService: BlacklistChannelService,
		@Inject(forwardRef(() => ChannelService))
		private readonly channelService: ChannelService
	) {}

	async get(id: number, relations: any[]): Promise<User>
	{
		let user = await this.userRepository.findOne({ where: { id }, relations });
		user?.matchs?.reverse?.();
		return (user);
	}

	async create(id: number, fullname: string, urlImage: string): Promise<User>
	{
		let img = await this.pictureService.insertByURL(urlImage);
		await this.userRepository.save({ id, fullname, picture: img});
		return this.get(id, []);
	}

	async changeNickname(id: number, nickname: string): Promise<User>
	{
		let user = await this.get(id, []);
		user.nickname = (nickname.length == 0) ? null : nickname;
		return this.userRepository.save(user);
	}

	async changePicture(id: number, file: any): Promise<Picture>
	{
		const img = this.pictureService.insertByData(file);
		let user = await this.get(id, []);
		const id_img_for_remove = user.picture.id;
		user.picture = await img;
		await this.userRepository.save(user);
		this.pictureService.removeByID(id_img_for_remove);
		this.userAchievementService.insert(id, "Mona Lisa");
		return img;
	}

	async updateUser(user: User): Promise<User>
	{
		return this.userRepository.save(user);
	}

	async remove(id: number): Promise<DeleteResult>
	{
		const user = await this.get(id, []);
		const name = user.picture.name;
		await this.notificationService.removeAllByUser(user);
		await this.userAchievementService.removeAll(user);
		await this.friendService.removeAll(user);
		await this.disabled2FA(id);
		await this.matchService.removeAll(user);
		await this.messageService.removeAll(user);
		await this.blockService.removeAll(user);
		await this.accessChannel.removeAll(user);
		await this.adminChannel.removeAll(user);
		await this.blackListChannelService.removeAll(user);
		await this.channelService.removeAll(id);
		const ret = await this.userRepository.delete({id: id});
		await this.pictureService.removeByName(name);
		return ret;
	}

	async activate2FA(id: number): Promise<Dfa>
	{
		const user = await this.get(id, ["dfa"]);
		if (user.dfa != null)
			return user.dfa;
		const dfa = await this.dfaService.insert(user.nickname ?? user.fullname);
		this.userRepository.save({id: user.id, dfa: dfa});
		return dfa;
	}

	async disabled2FA(id: number): Promise<User>
	{
		let user = await this.get(id, ["dfa"]);
		if (user.dfa === null)
			return user;
		const id_dfa_remove = user.dfa.id;
		const ret = await this.userRepository.save({ id: user.id, dfa: null });
		this.dfaService.remove(id_dfa_remove);
		return ret;
	}

	async checkCode(id: number, code: string): Promise<boolean>
	{
		let user = await this.get(id, ["dfa"]);
		if (user.dfa == null)
			return false;
		return this.dfaService.verifySecret(user.dfa.secret, code);
	}

	async rank(): Promise<User[]>
	{
		return this.userRepository.find({ order: {elo: "DESC"},
											take: 5  });
	}

	async search(search: string): Promise<User[]>
	{
		return this.userRepository.find({ where: [{fullname: ILike(`%${search}%`)},
													{nickname: ILike(`%${search}%`)}] });
	}
}
