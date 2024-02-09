import { Test, TestingModule } from '@nestjs/testing';
import { GameService } from './game.service';
import { Game } from './entities/game.entity';
import { CreateGameDto } from './dto/create-game.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('GameService', () => {
  let service: GameService;
  const gameData = {
    name: 'Tic-tac-toe',
    description: 'A boring game',
    thumbnail: "I don't know",
    url: 'http://localhost:3000',
  };

  const gameData2 = {
    name: 'Chess',
    description: 'Also boring',
    thumbnail: 'Hello',
    url: 'http://chess.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameService],
    }).compile();

    service = module.get<GameService>(GameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a game', () => {
    try {
      const g = service.create(gameData);

      expect(g.gid).toBeGreaterThanOrEqual(0);
      expect(g.description).toBe(gameData.description);
      expect(g.name).toBe(gameData.name);
      expect(g.thumbnail).toBe(gameData.thumbnail);
      expect(g.url).toBe(gameData.url);
    } catch (err) {
      console.error(err);
      expect(true).toBe(false);
    }
  });

  it('should fail to create', () => {
    const gameData1 = {
      name: 'Tic-tac-toe',
    };

    const gameData2 = {
      description: 'A boring game',
    };

    const gameData3 = {
      thumbnail: "I don't know",
    };

    try {
      service.create(gameData1 as Game);
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toBeDefined();
    }

    try {
      service.create(gameData2 as Game);
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toBeDefined();
    }

    try {
      service.create(gameData3 as Game);
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toBeDefined();
    }
  });

  it('should gives an empty array', () => {
    expect(service.findAll()).toEqual([]);
  });

  it('should have 1 item', () => {
    service.create(gameData);

    expect(service.findAll()[0].name).toBe(gameData.name);
    expect(service.findAll()[0].description).toBe(gameData.description);
    expect(service.findAll()[0].thumbnail).toBe(gameData.thumbnail);
    expect(service.findAll()[0].url).toBe(gameData.url);
  });

  it('should have 5 items', () => {
    service.create(gameData);
    service.create(gameData);
    service.create(gameData);
    service.create(gameData);
    service.create(gameData);

    expect(service.findAll().length).toBe(5);
  });

  it('should be able to find the item', () => {
    const g = service.create(gameData);

    try {
      const g2 = service.findOne(g.gid);
      expect(g2).toEqual(g);
    } catch (err) {
      console.error(err);
      expect(true).toBe(false);
    }
  });

  it('should not be able to find the item', () => {
    try {
      service.create({ name: 'Tic-tac-toe' } as CreateGameDto);
      expect(true).toBe(false);
    } catch (err) {
      try {
        expect(err).toBeInstanceOf(BadRequestException);
        service.findOne(0);
        expect(true).toBe(false);
      } catch (err2) {
        // It should throw NotFoundException
        expect(err2).toBeInstanceOf(NotFoundException);
      }
    }
  });

  it('should update', () => {
    const g = service.create(gameData);

    const g2 = service.update(g.gid, { name: gameData2.name });
    expect(g2.name).toBe(gameData2.name);
    expect(g2.gid).toBe(g.gid);

    const g3 = service.update(g.gid, { thumbnail: gameData2.thumbnail });
    expect(g3.thumbnail).toBe(gameData2.thumbnail);
    expect(g3.gid).toBe(g.gid);

    const g4 = service.update(g.gid, { description: gameData2.description });
    expect(g4.description).toBe(gameData2.description);
    expect(g4.gid).toBe(g.gid);

    const g5 = service.update(g.gid, { url: gameData2.url });
    expect(g5.url).toBe(gameData2.url);
    expect(g5.gid).toBe(g.gid);
  });

  it('should update in batch', () => {
    const g = service.create(gameData);

    const g2 = service.update(g.gid, gameData2);

    expect(g2).toEqual({ ...gameData2, gid: g2.gid });
  });

  it('should not update because of not found', () => {
    try {
      service.update(100, { name: 'Hello World' });
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundException);
    }
  });

  it('should delete', () => {
    const len = service.findAll().length;
    const g = service.create(gameData);
    service.remove(g.gid);
    const len2 = service.findAll().length;

    expect(len).toBe(len2);
  });
});
