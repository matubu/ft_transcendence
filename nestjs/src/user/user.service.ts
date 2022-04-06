import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { DeleteResult, Repository } from 'typeorm'
import { User } from './user.entity'
import { Dfa } from 'src/dfa/dfa.entity'
import { DfaService } from 'src/dfa/dfa.service';
import { Picture } from 'src/picture/picture.entity';
import { PictureService } from 'src/picture/picture.service';
const fs = require('fs')

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

	async create(id: number, fullname: string, urlImage: string): Promise<User>
	{
		let img = await this.pictureService.insertByURL(urlImage);
		await this.userRepository.save({id: id, fullname: fullname, picture: img});
		return this.get(id, []);
	}

	async changeNickname(id: number, nickname: string): Promise<User>
	{
		let user = await this.get(id, []);
		user.nickname = nickname;
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
		return img;
	}

	async remove(id: number): Promise<DeleteResult>
	{
		const user = await this.get(id, []);
		const name = user.picture.name;
		const ret = this.userRepository.delete({id: id});
		fs.unlinkSync(process.cwd() + "/upload/images/" + name);
		return ret;
	}

	async activate2FA(id:number): Promise<Dfa>
	{
		const user = await this.get(id, ["dfa"]);
		if (user.twoauth)
			return user.dfa;
		const dfa = await this.dfaService.insert(user.nickname ?? user.fullname);
		this.userRepository.save({id: user.id, twoauth: true, dfa: dfa});
		return dfa;
	}

	async disabled2FA(id: number): Promise<User>
	{
		let user = await this.get(id, ["dfa"]);
		if (!user.twoauth)
			return user;
		const id_dfa_remove = user.dfa.id;
		const ret = await this.userRepository.save({ id: user.id, twoauth: false, dfa: null });
		this.dfaService.remove(id_dfa_remove);
		return ret;
	}

	async checkCode(id: number, code: string): Promise<boolean>
	{
		let user = await this.get(id, ["dfa"]);
		if (user.twoauth == false)
			return false;
		return this.dfaService.verifySecret(user.dfa.secret, code);
	}
}
