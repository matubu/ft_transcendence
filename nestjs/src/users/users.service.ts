import { Injectable, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './entity/users.entity';
import { UsersInterface } from './interfaces/users.interface';
import twofactor, { generateSecret, verifyToken } from "node-2fa";
import { FastifyRequest } from 'fastify';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(Users)
		private usersRepository: Repository<Users>,
	) {}
	
	async insert(user_interface: UsersInterface)
	{
		const user = new Users();
		if (user_interface.id === undefined
			|| user_interface.fullname == undefined
			|| user_interface.twoauth == undefined
			|| user_interface.img == undefined
			|| user_interface.elo == undefined)
			return ;
		if ((await this.findOne(user_interface.id.toString())) !== undefined)
			return ;
		user.id42 = user_interface.id;
		user.fullname = user_interface.fullname;
		user.nickname = user_interface.nickname;
		user.twoauth = user_interface.twoauth;
		user.code2FA = user_interface.code2FA;
		user.img = user_interface.img;
		user.elo = user_interface.elo;
		await this.usersRepository.save(user)
	}

	async update(user_interface: UsersInterface)
	{
		if (user_interface?.id === undefined)
			return ;
		const userUpdate = await this.usersRepository.findOne({ id42: +user_interface.id })
		if (user_interface.fullname !== undefined)
			userUpdate.fullname = user_interface.fullname;
		if (user_interface.nickname !== undefined)
			userUpdate.nickname = user_interface.nickname;
		if (user_interface.twoauth !== undefined)
			userUpdate.twoauth = user_interface.twoauth;
		if (user_interface.code2FA !== undefined)
			userUpdate.code2FA = user_interface.code2FA;
		if (user_interface.img !== undefined)
			userUpdate.img = user_interface.img;
		if (user_interface.elo !== undefined)
			userUpdate.elo = user_interface.elo;
		await this.usersRepository.save(userUpdate)
	}

	findAll(): Promise<Users[]> {
		return this.usersRepository.find();
	}

	findOne(id: string): Promise<Users> {
		return this.usersRepository.findOne({ id42: +id });
	}

	async remove(id: string) {
		return await this.usersRepository.delete({ id42: +id });
	}

	findRank(): Promise<Users[]> {
		return this.usersRepository.find({order: {elo: "DESC"}, take: 100});
	}
	findRankNumber(number: string): Promise<Users[]> {
		if (+number <= 0)
			return ;
		return this.usersRepository.find({order: {elo: "DESC"}, take: +number});
	}

	async check_code(id: string, code: string): Promise<boolean> {
		const user: Users = await this.findOne(id);
		if (!user) return false;
		console.log(user.code2FA, code, verifyToken(user.code2FA, code))
		return verifyToken(user.code2FA, code)?.delta === 0;
	}

	async activate_2fa(id: string): Promise<string>
	{
		const user: Users = await this.findOne(id);
		if (!user) return;
		if (user.code2FA) return;
		const secret = generateSecret({ name: "ft_transcendence", account: `${user.nickname ?? user.fullname}` });
		let updated: UsersInterface = {twoauth: true, code2FA: secret.secret, id: +id}
		await this.update(updated)
		return secret.qr;
	}

	async disable_2fa(id: string)
	{
		const user: Users = await this.findOne(id);
		if (!user) return;
		if (!user.code2FA) return;
		let updated: UsersInterface = {twoauth: false, code2FA: null, id: +id}
		await this.update(updated)
	}
}
