import { Module } from '@nestjs/common';

import { GameModule } from './game/game.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './game/entities/game.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'root',
      password: 'root',
      database: 'testgservice',
      entities: [Game],
      synchronize: true,
    }),
    GameModule
  ],
})
export class AppModule {}
