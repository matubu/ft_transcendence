import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { Match } from './match.entity';
import { MatchService } from './match.service';

@Module({
	imports: [TypeOrmModule.forFeature([Match]),
				UserModule],
	providers: [MatchService],
	exports: [MatchService]
})
export class MatchModule {}
