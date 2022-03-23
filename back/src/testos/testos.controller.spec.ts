import { Test, TestingModule } from '@nestjs/testing';
import { TestosController } from './testos.controller';

describe('TestosController', () => {
  let controller: TestosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestosController],
    }).compile();

    controller = module.get<TestosController>(TestosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
