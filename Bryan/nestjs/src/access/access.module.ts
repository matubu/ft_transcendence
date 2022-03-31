import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Access } from './access.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Access])]
})
export class AccessModule {}
