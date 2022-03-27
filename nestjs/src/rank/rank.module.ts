import { Module } from '@nestjs/common';
import { RankController } from './rank.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [RankController],
  imports: [UsersModule]
})
export class RankModule {}
