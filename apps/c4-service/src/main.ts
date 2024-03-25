/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { Gateway } from '@bb/gateway-lib';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = +process.env.PORT || 4032; // avoiding conflict with ttt service
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );

  const gatewayHost = process.env.GATEWAY_HOST || 'localhost';
  const gatewayPort = Number(process.env.GATEWAY_KEY) || 3000;
  const gatewayFull = `${gatewayHost}:${gatewayPort}`;
  const key = process.env.SERVICE_KEY || 'c4-service';
  // Register with gateway
  new Gateway(gatewayFull)
    .RegisterService({
      key,
      port,
      prefix: globalPrefix,
    })
    .then((res) => {
      console.log(
        `Registered to Gateway API.\nKey: ${res.key}, endpoint: ${res.endpoint}`
      );
    })
    .catch((err) => console.error(err));
}

bootstrap();
