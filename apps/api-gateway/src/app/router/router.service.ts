import { Injectable } from '@nestjs/common';
import { CreateRouterDto } from './dto/create-router.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Route } from './entities/route.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RouterService {
  constructor(
    @InjectRepository(Route)
    private routeRepo: Repository<Route>
  ) {}

  static getIPv4(ip) {
    if (ip.substr(0, 7) === '::ffff:') {
      ip = ip.substr(7);
    }
    return ip;
  }

  async create(createRouterDto: CreateRouterDto & { ip: string }) {
    let newRoute = await this.findOne(createRouterDto.key);
    if (newRoute == null) {
      newRoute = new Route();
    }

    newRoute.key = createRouterDto.key;
    newRoute.ip = RouterService.getIPv4(createRouterDto.ip);
    newRoute.port = createRouterDto.port;
    newRoute.prefix = createRouterDto.prefix;

    newRoute = await this.routeRepo.save(newRoute);

    return newRoute;
  }

  findAll() {
    return this.routeRepo.find();
  }

  findOne(key: string) {
    return this.routeRepo.findOneBy({ key });
  }

  remove(key: string) {
    this.routeRepo.delete(key);
  }
}
