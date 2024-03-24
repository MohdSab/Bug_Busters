import {
  All,
  BadRequestException,
  Controller,
  Get,
  Param,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import http from 'http';
import { RouterService } from '../router/router.service';
import httpProxy from 'http-proxy';
import { Route } from '../router/entities/route.entity';

@Controller('proxy')
export class ProxyController {
  static port: number;
  static proxy: httpProxy;
  static routerService: RouterService;

  constructor(private routerService: RouterService) {
    const port = +process.env.WS_PROXY_PORT || 3002;
    ProxyController.port = port;
    ProxyController.proxy = httpProxy.createProxyServer();

    ProxyController.proxy.on('proxyReq', (proxyReq, req, res, options) => {
      proxyReq.path =
        '/' +
        proxyReq.getHeader('prefix') +
        '/' +
        proxyReq.path.split('/').slice(3).join('/');

      const body = JSON.stringify(req['body']);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(body));

      proxyReq.write(body);
      proxyReq.end();
    });

    http
      .createServer((req, res) => ProxyController.proxy.web(req, res))
      .on('upgrade', (req, socket, head) => {
        const key = req.headers.key as string;

        if (!key) {
          req.destroy(new BadRequestException('key is missing from header'));
          return;
        }

        fetch('http://localhost:3000/api/routes/' + key)
          .then((res) => res.json())
          .then((route: Route) => {
            console.log(route);
            if (!route) {
              req.destroy(
                new BadRequestException('cannot find service with key ' + key)
              );
              return;
            }
            ProxyController.proxy.ws(
              req,
              socket,
              head,
              {
                target: {
                  host: route.ip,
                  port: route.port,
                  path: route.prefix,
                },
              },
              (err) => {
                console.error(err);
                return;
              }
            );
          });
      })
      .listen(port);

    console.log(`Proxy server is running on port ${port}`);
  }

  @All(['/:key', '/:key/*'])
  proxyRequest(
    @Req() req: Request,
    @Res() res: Response,
    @Param('key') key: string
  ) {
    return this.routerService.findOne(key).then((route) => {
      console.log('proxying to ', route);
      if (route !== null) {
        req.headers.prefix = route.prefix;
        ProxyController.proxy.web(
          req,
          res,
          {
            target: {
              host: route.ip,
              port: route.port,
            },
          },
          (err) => console.error(err)
        );
      } else {
        res.json(new BadRequestException('Not found service with key ' + key));
        res.status(404);
      }
    });
  }
}
