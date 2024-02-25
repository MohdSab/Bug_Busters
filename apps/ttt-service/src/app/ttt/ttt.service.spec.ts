import { Test, TestingModule } from '@nestjs/testing';
import { TttService } from './ttt.service';

describe('TttService', () => {
  let service: TttService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TttService],
    }).compile();

    service = module.get<TttService>(TttService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
