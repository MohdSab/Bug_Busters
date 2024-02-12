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
import { CreateRouteDto } from './dto/CreateRoute.dto';
import { Request, Response } from 'express';

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

  @Post('/routes')
  createRoute(@Body() data: CreateRouteDto, @Ip() ip: string) {
    return this.appService.createRoute(data, ip);
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
  @Post('/service/:key/*')
  @Put('/service/:key/*')
  @Patch('/service/:key/*')
  @Delete('/service/:key/*')
  async proxyRequest(
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
    return res;
  }
}
