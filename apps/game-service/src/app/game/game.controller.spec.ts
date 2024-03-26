import { Test, TestingModule } from '@nestjs/testing';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { Repository } from 'typeorm';

class GameRepo extends Repository<Game> {}


describe('GameController', () => {
  let controller: GameController;
  let gameRepo: GameRepo;

  beforeEach(async () => {
    const gameRepoToken = getRepositoryToken(Game);
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameController],
      providers: [
        GameService,
        {
          provide: gameRepoToken,
          useClass: GameRepo
        }
      ],
    }).compile();

    controller = module.get<GameController>(GameController);
    gameRepo = module.get<GameRepo>(gameRepoToken);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
