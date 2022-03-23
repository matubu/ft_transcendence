import { Module } from '@nestjs/common';
import { TestosController } from './testos.controller';
import { TestosService } from './testos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Testos } from './entity/testos.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Testos])],
  controllers: [TestosController],
  providers: [TestosService]
})
export class TestosModule {}
