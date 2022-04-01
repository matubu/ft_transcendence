import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dfa } from './dfa.entity';
import { DfaService } from './dfa.service';

@Module({
	imports: [TypeOrmModule.forFeature([Dfa])],
	providers: [DfaService]
})
export class DfaModule {}
