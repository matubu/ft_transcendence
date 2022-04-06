import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminChannel } from './admin-channel.entity';

@Module({
	imports: [TypeOrmModule.forFeature([AdminChannel])]
})
export class AdminModule {}
