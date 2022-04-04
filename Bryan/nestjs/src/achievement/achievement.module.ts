import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AchievementController } from './achievement.controller';
import { Achievement } from './achievement.entity';
import { AchievementService } from './achievement.service';

@Module({
  controllers: [AchievementController],
  providers: [AchievementService],
  imports: [TypeOrmModule.forFeature([Achievement])]
})
export class AchievementModule {}
