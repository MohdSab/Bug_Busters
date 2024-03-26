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
  let service: GameService;

  const newGame = new Game();

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
    service = module.get<GameService>(GameService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a game', () => {
    const temp = {
      gid: 1,
      name: 'Tic-tac-toe',
      description: 'A boring game',
      thumbnail: "I don't know",
      url: 'http://localhost:3000',
    };
    jest.spyOn(service, 'create').mockReturnValueOnce(newGame);
    expect(controller.create(temp)).toEqual(newGame);
  });

  it('should return a game', () => {
    jest.spyOn(service, 'findOne').mockReturnValueOnce(Promise.resolve(newGame));
    expect(controller.findOne('1')).toEqual(Promise.resolve(newGame));
  });
});
