import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RouterModule } from './router/router.module';
import { ProxyController } from './proxy/proxy.controller';

@Module({
  imports: [
    RouterModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: +process.env.DB_PORT || 5432,
      username: process.env.DB_USER || 'gateway',
      password: process.env.DB_PW || 'gateway',
      database: process.env.DB_DB || 'gateway',
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
  controllers: [ProxyController],
  providers: [],
})
export class AppModule {}
