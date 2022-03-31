import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './user.entity'

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>
	) {}

	async findAll(): Promise<User[]> {
		let user = new User;
		user.id = 12890;
		user.fullname = "sdfsd";

		await this.userRepository.save(user);

		return this.userRepository.find({
			relations: ["picture", "dfa", "friends",
						"adminChannels", "accessChannels",
						"notifications"],
		});
	}
}
