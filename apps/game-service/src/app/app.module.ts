import { Module } from '@nestjs/common';

import { GameModule } from './game/game.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: +process.env.DB_PORT || 5432,
      username: process.env.DB_USER || 'game',
      password: process.env.DB_PW || 'game',
      database: process.env.DB_DB || 'game',
      autoLoadEntities: true,
      synchronize: true,
    }),
    GameModule,
  ],
})
export class AppModule {}
