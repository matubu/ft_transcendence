import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Achievement } from './achievement.entity';
import { AchievementService } from './achievement.service';
import { AchievementController } from './achievement.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Achievement])],
  providers: [AchievementService],
  exports: [AchievementService],
  controllers: [AchievementController]
})
export class AchievementModule {}
