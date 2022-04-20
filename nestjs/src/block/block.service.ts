import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { DeleteResult, Repository } from 'typeorm';
import { Block } from './block.entity';

@Injectable()
export class BlockService {
	constructor(
		@InjectRepository(Block)
		private blockRepository: Repository<Block>,
		@Inject(forwardRef(() => UserService))
		private readonly userService: UserService) {}

	async block(userId: number, blockId: number): Promise<Block> {
		if (userId == blockId)
			new UnauthorizedException();
		const user = await this.userService.get(userId, []);
		const blocked = await this.userService.get(blockId, []);
		return this.blockRepository.save({ user, blocked });
	}

	async unblock(userId: number, blockId: number): Promise<DeleteResult> {
		if (userId == blockId)
			new UnauthorizedException();
		const user = await this.userService.get(userId, []);
		const blocked = await this.userService.get(blockId, []);
		return this.blockRepository.delete({ user, blocked });
	}

	async isblock(userId: number, blockId: number): Promise<boolean> {
		const user = await this.userService.get(userId, []);
		const blocked = await this.userService.get(blockId, []);
		const val = await this.blockRepository.findOne({ where: { user, blocked } });
		if (val == undefined)
			return false;
		return true;
	}

	async getBlock(userId: number): Promise<Block[]> {
		const user = await this.userService.get(userId, []);
		return this.blockRepository.find({ where: { user }});
	}
}