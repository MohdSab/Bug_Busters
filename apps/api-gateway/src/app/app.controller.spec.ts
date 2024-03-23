import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CreateRouteDto } from '@bb/gateway-lib';

describe('AppController', () => {
  let app: TestingModule;
  let con: AppController;
  const data: CreateRouteDto & { ip: string } = {
    key: 'test',
    port: 1234,
    prefix: 'test',
    ip: '127.0.0.1',
  };

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();
    con = app.get<AppController>(AppController);
    // console.log(con);
    // console.log(app);
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      expect(con.getData()).toEqual({ message: 'Hello API' });
    });
  });

  describe('create route', () => {
    it('should successfully create a route', () => {
      return con.createRoute(data, data.ip).then((res) => {
        expect(res.key).toBe(data.key);
      });
    });

    it('should successfully get a route', () => {
      return con
        .createRoute(data, data.ip)
        .then(() => con.getAllRoutes())
        .then((res) => {
          expect(res.length).toBe(1);
        });
    });
  });
});
