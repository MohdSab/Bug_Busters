import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { CreateRouteDto } from '@bb/gateway-lib';
import { RouteResp } from '@bb/gateway-lib';
import { Route } from './entities/Route.entity';

@Injectable()
export class AppService {
  routes: { [key: string]: Route } = {};

  getData(): { message: string } {
    return { message: 'Hello API' };
  }

  getAllRoutes(): Promise<RouteResp[]> {
    return Promise.resolve(
      Object.keys(this.routes).map((key) => this.routes[key])
    );
  }

  getRoute(key: string): Promise<RouteResp> {
    if (!Object.keys(this.routes).includes(key)) throw new NotFoundException();
    return Promise.resolve({
      key,
      endpoint: this.routes[key].endpoint,
    });
  }

  createRoute(data: CreateRouteDto, ip: string): Promise<RouteResp> {
    const newRoute: Route = {
      key: data.key,
      ip: ip,
      port: data.port,
      prefix: data.prefix,
      endpoint: `/service/${data.key}`,
    };
    this.routes[data.key] = newRoute;

    return Promise.resolve({ key: newRoute.key, endpoint: newRoute.endpoint });
  }

  deleteRoute(key: string, ip: string, port: number): Promise<void> {
    if (!Object.keys(this.routes).includes(key)) throw new NotFoundException();
    else {
      const route = this.routes[key];
      if (ip !== route.ip || port !== route.port)
        throw new BadRequestException();
      delete this.routes[key];
      return;
    }
  }

  proxyRequest(key: string, endpoint: string, req: Request) {
    if (!Object.keys(this.routes).includes(key)) throw new NotFoundException();

    const route = this.routes[key];
    const url = `http://${route.ip}:${route.port}/${route.prefix}${endpoint}`;
    return fetch(url, {
      method: req.method,
      headers: {
        Authorization: req.headers.authorization,
        'Content-Type': req.headers['content-type'],
      },
      body: req.body,
    }).then((res) => ({ res: res.json(), status: res.status }));
  }
}
