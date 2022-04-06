import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessChannel } from './access-channel.entity';

@Module({
	imports: [TypeOrmModule.forFeature([AccessChannel])]
})
export class AccessModule {}
