import { Controller, Get, Post, Body, Param, Delete, Ip } from '@nestjs/common';
import { RouterService } from './router.service';
import { CreateRouterDto } from './dto/create-router.dto';

@Controller('api/routes')
export class RouterController {
  constructor(private readonly routerService: RouterService) {}

  @Post()
  create(@Body() createRouterDto: CreateRouterDto, @Ip() ip: string) {
    return this.routerService.create({ ...createRouterDto, ip });
  }

  @Get()
  findAll() {
    return this.routerService.findAll();
  }

  @Get(':key')
  findOne(@Param('key') key: string) {
    return this.routerService.findOne(key);
  }

  @Delete(':key')
  remove(@Param('key') key: string) {
    return this.routerService.remove(key);
  }
}
