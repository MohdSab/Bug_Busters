/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { join } from 'path';
import { Gateway } from '@bb/gateway-lib';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.useStaticAssets(join(__dirname, 'public'));
  app.enableCors();
  const port = +process.env.PORT || 3010;
  const key = process.env.AUTH_KEY || 'auth';
  const gatewayHost = process.env.GATEWAY_HOST || 'localhost';
  const gatewayPort = Number(process.env.GATEWAY_KEY) || 3000;
  const gatewayDest = `${gatewayHost}:${gatewayPort}`;
  await app.listen(port);
  Logger.log('Port: ' + port);
  Logger.log('key: ' + key);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );

  new Gateway(gatewayDest)
    .RegisterService({
      key,
      port,
      prefix: globalPrefix,
    })
    .then((res) => {
      Logger.log(
        `Registered to Gateway API.\nKey: ${res.key}, endpoint: ${res.endpoint}`
      );
    })
    .catch((err) => Logger.error(err));
}

bootstrap();
