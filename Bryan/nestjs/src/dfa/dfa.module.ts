import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dfa } from './dfa.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Dfa])]
})
export class DfaModule {}
