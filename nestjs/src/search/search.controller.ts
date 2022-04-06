import { Controller, Get, Param } from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
	constructor(private readonly searchService: SearchService) {}

	@Get(':search')
	async search(@Param('search') search: string): Promise<User[]>
	{
		return await this.searchService.search(search);
	}
}
