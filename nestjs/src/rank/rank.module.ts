import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { RankController } from './rank.controller';
import { RankService } from './rank.service';

@Module({
  controllers: [RankController],
  providers: [RankService],
  imports: [UserModule]
})
export class RankModule {}
