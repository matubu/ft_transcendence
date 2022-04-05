import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './admin.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Admin])]
})
export class AdminModule {}
