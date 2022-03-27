import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Matchs } from './entity/matchs.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Matchs])],
})
export class MatchsModule {}
