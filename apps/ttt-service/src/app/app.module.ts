import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TttModule } from './ttt/ttt.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: +process.env.DB_PORT || 5432,
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PW || 'root',
      database: process.env.DB_DB || 'ttt',
      autoLoadEntities: true,
      synchronize: true,
      // logging: true,
    }),
    TttModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
