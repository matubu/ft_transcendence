import { Module } from '@nestjs/common';
import { TestosController } from './testos.controller';
import { TestosService } from './testos.service';

@Module({
  controllers: [TestosController],
  providers: [TestosService]
})
export class TestosModule {}
