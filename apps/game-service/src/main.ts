/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { Gateway } from '@bb/gateway-lib';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors();
  const port = +process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );

  const gatewayHost = `${process.env.GATEWAY_HOST}:${process.env.GATEWAY_PORT}`;
  new Gateway(gatewayHost)
    .RegisterService({
      key: process.env.SERVICE_KEY || 'game-service',
      port,
      prefix: 'api',
    })
    .then((route) => {
      Logger.log(
        `Registered to gateway with key ${route.key} and endpoint ${route.endpoint}`
      );
    })
    .catch((err) => Logger.error(err));
}

bootstrap();
