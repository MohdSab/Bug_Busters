import { Controller, Get, Post, Body, Param, Delete, Ip } from '@nestjs/common';
import { RouterService } from './router.service';
import { CreateRouterDto } from './dto/create-router.dto';
import { RouteResp } from '@bb/gateway-lib';
import { Route } from './entities/route.entity';

@Controller('api/routes')
export class RouterController {
  constructor(private readonly routerService: RouterService) {}

  @Post()
  create(@Body() createRouterDto: CreateRouterDto, @Ip() ip: string) {
    return this.routerService
      .create({ ...createRouterDto, ip })
      .then((route) => ({
        key: route.key,
        endpoint: '/proxy/' + route.key,
      }));
  }

  @Get()
  findAll() {
    return this.routerService
      .findAll()
      .then((res) => res.map(this.getRouteResp));
  }

  @Get(':key')
  findOne(@Param('key') key: string) {
    return this.routerService.findOne(key).then(this.getRouteResp);
  }

  @Delete(':key')
  remove(@Param('key') key: string) {
    return this.routerService.remove(key);
  }

  getRouteResp(route: Route): RouteResp {
    return {
      ...route,
      endpoint: '/proxy/' + route.key,
    };
  }
}
