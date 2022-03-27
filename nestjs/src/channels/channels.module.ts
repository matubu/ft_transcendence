import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channels } from './entity/channels.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Channels])],
})
export class ChannelsModule {}
