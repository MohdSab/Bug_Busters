import {
  Body,
  Controller,
  Delete,
  Get,
  Ip,
  Param,
  Patch,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';

import { AppService } from './app.service';
import { Request, Response } from 'express';
import { CreateRouteDto } from '@bb/gateway-lib';

@Controller('/api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Get('/routes/:key')
  getRoute(@Param('key') key: string) {
    console.log(key);
    return this.appService.getRoute(key);
  }

  @Get('/routes')
  getAllRoutes() {
    return this.appService.getAllRoutes();
  }

  getIPv4(ip) {
    if (ip.substr(0, 7) === '::ffff:') {
      ip = ip.substr(7);
    }
    return ip;
  }

  @Post('/routes')
  createRoute(@Body() body: CreateRouteDto, @Ip() ip: string) {
    return this.appService.createRoute(body, this.getIPv4(ip));
  }

  @Delete('/routes/:key')
  deleteRoute(
    @Param('key') key: string,
    @Ip() ip: string,
    @Body('port') port: number
  ) {
    return this.appService.deleteRoute(key, ip, port);
  }

  @Get('/service/:key/*')
  async fuk(
    @Param('key') key: string,
    @Req() req: Request,
    @Res() response: Response
  ) {
    const endpoint = req.params[0];

    const { res, status } = await this.appService.proxyRequest(
      key,
      endpoint,
      req
    );
    response.status(status);
    response.json(await res);
    return null;
  }

  @Post('/service/:key/*')
  @Put('/service/:key/*')
  @Patch('/service/:key/*')
  @Delete('/service/:key/*')
  async proxyRequest(
    @Param('key') key: string,
    @Req() req: Request,
    @Res() response: Response
  ) {
    const endpoint = '/' + req.params[0];

    const { res, status } = await this.appService.proxyRequest(
      key,
      endpoint,
      req
    );
    response.status(status);
    response.json(await res);
    return null;
  }
}
