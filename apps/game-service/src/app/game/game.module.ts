import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';

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
    TypeOrmModule.forFeature([Game])
  ],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
