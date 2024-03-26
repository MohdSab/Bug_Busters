import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connect4Module } from './c4/c4.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: +process.env.DB_PORT || 5432,
      username: process.env.DB_USER || 'c4',
      password: process.env.DB_PW || 'c4',
      database: process.env.DB_DB || 'c4',
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
    }),
    Connect4Module,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
