import { Test } from '@nestjs/testing';

import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = app.get<AppService>(AppService);
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      expect(service.getData()).toEqual({ message: 'Hello API' });
    });
  });

  describe('routes CRUD success', () => {
    it('should create a route', () => {
      const key = 'hello';
      return service
        .createRoute({ key, port: 1234 }, '127.0.0.1')
        .then((res) => {
          expect(res.key).toBe(key);
        });
    });

    it('should be able to get a route', () => {
      const key = 'hello';
      return service
        .createRoute({ key, port: 1234 }, '127.0.0.1')
        .then((res) => {
          return service
            .getRoute(key)
            .then((res2) => {
              expect(res2).toEqual(res);
            })
            .catch(() => expect(true).toBe(false));
        });
    });

    it('should has 2 routes', () => {
      const key1 = 'hello';
      const key2 = 'world';

      return Promise.all([
        service.createRoute({ key: key1, port: 1234 }, '127.0.0.1'),
        service.createRoute({ key: key2, port: 1235 }, '127.0.0.1'),
      ])
        .then(() => service.getAllRoutes())
        .then((routes) => {
          expect(routes.length).toBe(2);
          expect(routes[0].key).toMatch(new RegExp(`(${key1})|(${key2})`));
        });
    });

    it('should delete a route', () => {
      const key = 'hello';
      const data = { port: 1234, key };
      const ip = '127.0.0.1';

      return service
        .createRoute(data, ip)
        .then(() => {
          return service.deleteRoute(key, ip, data.port);
        })
        .then(() => service.getAllRoutes())
        .then((res) => expect(res.length).toBe(0))
        .catch(() => expect(true).toBe(false));
    });
  });
});
