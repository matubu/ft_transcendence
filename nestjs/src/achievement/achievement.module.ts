import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Achievement } from './achievement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Achievement])]
})
export class AchievementModule {}
