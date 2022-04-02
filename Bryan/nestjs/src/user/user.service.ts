import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { DeleteResult, Repository } from 'typeorm'
import { User } from './user.entity'
import { Dfa } from 'src/dfa/dfa.entity'
import { DfaService } from 'src/dfa/dfa.service';
import { Picture } from 'src/picture/picture.entity';
import { PictureService } from 'src/picture/picture.service';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
		private readonly dfaService: DfaService,
		private readonly pictureService: PictureService
	) {}

	async get(id: number, relations: any[]): Promise<User>
	{
		return this.userRepository.findOne({ where: {id: id}, relations: relations});
	}

	async create(id: number, fullname: string, picture: Picture): Promise<User>
	{
		await this.userRepository.save({id: id, fullname: fullname, picture: picture});
		return this.get(id, ["picture"]);
	}

	async changeNickname(id: number, nickname: string): Promise<User>
	{
		let user = await this.get(id, []);
		user.nickname = nickname;
		return this.userRepository.save(user);
	}

	async changePicture(id: number, file: any): Promise<Picture>
	{
		let img = this.pictureService.insertByData(file);
		let user = await this.get(id, ["picture"]);
		this.pictureService.removeByID(user.picture.id);
		user.picture = await img;
		return img;
	}

	async remove(id: number): Promise<DeleteResult>
	{
		let user = await this.get(id, ["notification", "picture", "dfa"]);
		this.userRepository.softRemove(user.notifications);
		this.userRepository.softRemove(user.dfa);
		this.pictureService.removeByID(user.picture.id);
		/*
			Remove friends, channels 
		*/
		return this.userRepository.delete({id: id});
	}

	async activate2FA(id:number): Promise<Dfa>
	{
		let user = await this.get(id, ["dfa"]);
		if (user.twoauth)
			return user.dfa;
		let dfa = await this.dfaService.insert(user.nickname ?? user.fullname);
		this.userRepository.save({id: user.id, twoauth: true, dfa: dfa});
		return dfa;
	}

	async disabled2FA(id: number): Promise<User>
	{
		let user = await this.get(id, ["dfa"]);
		this.userRepository.softRemove(user.dfa);
		return this.userRepository.save({id: user.id, twoauth: false});
	}

	async checkCode(id: number, code: string): Promise<boolean>
	{
		let user = await this.get(id, ["dfa"]);
		if (user.twoauth == false)
			return false;
		return this.dfaService.verifySecret(user.dfa.secret, code);
	}
}
