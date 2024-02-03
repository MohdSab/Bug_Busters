import { Test } from '@nestjs/testing';

import { AppService } from './app.service';
import { AccountRepo } from './account.repo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './account.entity';

describe('AppService', () => {
  let service: AppService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'root',
          password: 'root',
          database: 'test',
          entities: [Account],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Account]),
      ],
      providers: [AppService],
    }).compile();

    service = app.get<AppService>(AppService);
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      expect(service.getData()).toEqual({ message: 'Hello API' });
    });
  });
});
