import { Test, TestingModule } from '@nestjs/testing';
import { TestosService } from './testos.service';

describe('TestosService', () => {
  let service: TestosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestosService],
    }).compile();

    service = module.get<TestosService>(TestosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
