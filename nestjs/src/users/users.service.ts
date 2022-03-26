import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './entity/users.entity';
import { UsersInterface } from './interfaces/users.interface';

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
}
