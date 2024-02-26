import { Test, TestingModule } from '@nestjs/testing';
import { TTTService } from './ttt.service';

describe('TttService', () => {
  let service: TTTService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TTTService],
    }).compile();

    service = module.get<TTTService>(TTTService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
