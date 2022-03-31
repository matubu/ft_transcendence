import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from './match.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Match])]
})
export class MatchModule {}
