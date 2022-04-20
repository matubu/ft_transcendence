import { Body, Controller, Get, Post } from '@nestjs/common';
import { Autorization } from 'src/auth.guard';
import { DeleteResult } from 'typeorm';
import { Block } from './block.entity';
import { BlockService } from './block.service';

@Controller('block')
export class BlockController {
	constructor(private readonly blockService: BlockService) {}

	@Get()
	async get(@Autorization() userId: number) : Promise<Block[]> {
		return await this.blockService.getBlock(userId);
	}

	@Post()
	async blocked(@Autorization() userId: number, @Body() body: { blocked: boolean, blockedId: number }): Promise<Block | DeleteResult> {
		if (body.blocked)
			return await this.blockService.block(userId, body.blockedId);
		return await this.blockService.unblock(userId, body.blockedId);
	}

}
