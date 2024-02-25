/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.useStaticAssets(join(__dirname, 'public'));
  app.enableCors();
  const port = process.env.PORT || 3010;
  const key = process.env.AUTH_KEY || 'auth';
  const gatewayHost = process.env.GATEWAY_HOST || 'localhost:3000';
  await app.listen(port);
  Logger.log('Port: ', port);
  Logger.log('key: ', key);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );

  // if (!process.env.GATEWAY_HOST) {
  //   console.log('GATEWAY_HOST is not provided, not registered to any Gateway');
  // } else {
  fetch(`http://${gatewayHost}/api/routes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      key,
      port,
      prefix: globalPrefix,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      console.log(
        `Registered to Gateway API.\nKey: ${res.key}, endpoint: ${res.endpoint}`
      );
    })
    .catch((err) => console.error(err));
  // }
}

bootstrap();
