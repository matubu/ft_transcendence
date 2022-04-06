import { Module } from '@nestjs/common';
import { AlcoholService } from './alcohol.service';

@Module({
  providers: [AlcoholService],
  exports: [AlcoholService]
})
export class AlcoholModule {}
