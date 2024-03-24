/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 4000; // avoiding conflict with ttt service
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );

  const gatewayHost = process.env.GATEWAY_HOST || 'localhost';
  const gatewayPort = Number(process.env.GATEWAY_KEY) || 3000;
  const key = process.env.SERVICE_KEY || 'c4-servic';
  // Register with gateway
  fetch(`http://${gatewayHost}:${gatewayPort}/api/routes`, {
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
}

bootstrap();
