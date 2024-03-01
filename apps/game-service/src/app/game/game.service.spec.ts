import { Test, TestingModule } from '@nestjs/testing';
import { GameService } from './game.service';
import { Game } from './entities/game.entity';
import { CreateGameDto } from './dto/create-game.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

class GameRepo extends Repository<Game> {}

describe('GameService', () => {
  let service: GameService;
  let gameRepo: GameRepo;

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
    const gameRepoToken = getRepositoryToken(Game);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameService,
        {
          provide: gameRepoToken,
          useClass: GameRepo,
        },
      ],
    }).compile();

    service = module.get<GameService>(GameService);
    gameRepo = module.get<GameRepo>(gameRepoToken);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a game', () => {

    const temp = {
      gid: 1,
      name: 'Tic-tac-toe',
      description: 'A boring game',
      thumbnail: "I don't know",
      url: 'http://localhost:3000',
    };

    try {
      jest
        .spyOn(gameRepo, 'findOne')
        .mockResolvedValueOnce(Promise.resolve({ ...gameData, gid: 1 }));

      jest
        .spyOn(service, 'create')
        .mockReturnValueOnce(temp)
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
    jest
      .spyOn(gameRepo, 'find')
      .mockResolvedValueOnce(Promise.resolve([]))
    service.findAll().then((res) => {expect(res).toEqual([])})
  });

  it('should have 1 item', async () => {

    const temp = {
      gid: 1,
      name: 'Tic-tac-toe',
      description: 'A boring game',
      thumbnail: "I don't know",
      url: 'http://localhost:3000',
    };

    jest
      .spyOn(gameRepo, 'find')
      .mockResolvedValueOnce(Promise.resolve([temp]))

    jest
      .spyOn(service, 'create')
      .mockReturnValueOnce(temp)

    service.create(gameData);

    let list:Game[];
    await service.findAll().then((res) => list = res)
    let game:Game = list[0];
    expect(game.name).toBe(gameData.name);
    expect(game.description).toBe(gameData.description);
    expect(game.thumbnail).toBe(gameData.thumbnail);
    expect(game.url).toBe(gameData.url);
  });

  it('should have 5 items', async () => {

    const temp = {
      gid: 1,
      name: 'Tic-tac-toe',
      description: 'A boring game',
      thumbnail: "I don't know",
      url: 'http://localhost:3000',
    };

    jest
      .spyOn(service, 'create')
      .mockReturnValue(temp)    

    jest
      .spyOn(gameRepo, 'find')
      .mockResolvedValueOnce(Promise.resolve([temp, temp, temp, temp, temp]));

    service.create(gameData);
    service.create(gameData);
    service.create(gameData);
    service.create(gameData);
    service.create(gameData);


    let games:Game[]
    const gamesPromise = await service.findAll().then((res) => games=res);
    expect(games.length).toBe(5);
  });

  it('should be able to find the item', async () => {

    const temp = {
      gid: 1,
      name: 'Tic-tac-toe',
      description: 'A boring game',
      thumbnail: "I don't know",
      url: 'http://localhost:3000',
    };

    jest
      .spyOn(service, 'create')
      .mockReturnValue(temp)   

    jest
      .spyOn(gameRepo, 'findOneBy')
      .mockResolvedValueOnce(Promise.resolve(temp))

    const g = service.create(gameData);

    try {
      let g2:Game;
      await service.findOne(g.gid).then((res) => g2 = res);
      expect(g2).toEqual(g);
    } catch (err) {
      console.error(err);
      expect(true).toBe(false);
    }
  });

  it('should not be able to find the item', () => { //TODO

    jest
      .spyOn(gameRepo, 'findOneBy')
      .mockImplementation(() => {throw new NotFoundException})

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

  it('should update', async () => {
    //there is probably a better way than this
    const createTemp = {
      gid:1,
      name: 'Tic-tac-toe',
      description: 'A boring game',
      thumbnail: "I don't know",
      url: 'http://localhost:3000',
    }

    const temp = {
      gid:1,
      name: 'Tic-tac-toe',
      description: 'A boring game',
      thumbnail: "I don't know",
      url: 'http://localhost:3000',
    };

    const tempUpdateName = {
      gid:1,
      name: gameData2.name,
      description: 'A boring game',
      thumbnail: "I don't know",
      url: 'http://localhost:3000',
    };

    const tempUpdateThumbNail = {
      gid:1,
      name: gameData2.name,
      description: 'A boring game',
      thumbnail: gameData2.thumbnail,
      url: 'http://localhost:3000',
    };

    const tempUpdateDesc = {
      gid:1,
      name: gameData2.name,
      description: gameData2.description,
      thumbnail: gameData2.thumbnail,
      url: 'http://localhost:3000',
    };
    
    const tempUpdateURL = {
      gid:1,
      name: gameData2.name,
      description: gameData2.description,
      thumbnail: gameData2.thumbnail,
      url: gameData2.url
    };

    jest
      .spyOn(gameRepo, 'findOneBy')
      .mockResolvedValue(Promise.resolve(temp));
    jest
      .spyOn(gameRepo, 'save')
      .mockResolvedValueOnce(Promise.resolve(tempUpdateName))
      .mockResolvedValueOnce(Promise.resolve(tempUpdateThumbNail))
      .mockResolvedValueOnce(Promise.resolve(tempUpdateDesc))
      .mockResolvedValueOnce(Promise.resolve(tempUpdateURL))
    jest
      .spyOn(service, 'create')
      .mockReturnValueOnce(createTemp)
    try{
      const g = service.create(gameData);
      //change name
      let g2:Game;
      await service.update(g.gid, { name: gameData2.name }).then((res) => g2=res);
      expect(g2.name).toBe(gameData2.name);
      expect(g2.gid).toBe(g.gid);
      //change thumbnail
      let g3:Game;
      await service.update(g.gid, { thumbnail: gameData2.thumbnail }).then((res) => g3=res);
      expect(g3.thumbnail).toBe(gameData2.thumbnail);
      expect(g3.gid).toBe(g.gid);
      //change description
      let g4:Game;
      await service.update(g.gid, { description: gameData2.description }).then((res) => g4=res);
      expect(g4.description).toBe(gameData2.description);
      expect(g4.gid).toBe(g.gid);
      //change url
      let g5:Game;
      await service.update(g.gid, { url: gameData2.url }).then((res) => g5=res);
      expect(g5.url).toBe(gameData2.url);
      expect(g5.gid).toBe(g.gid);
    }
    catch(error){
      console.error(error)      
    }
  });

  it('should update in batch', async () => {
    
    const temp = {
      gid:1,
      name: 'Tic-tac-toe',
      description: 'A boring game',
      thumbnail: "I don't know",
      url: 'http://localhost:3000',
    };

    const temp2 = {
      gid: 1,
      name: 'Chess',
      description: 'Also boring',
      thumbnail: 'Hello',
      url: 'http://chess.com',
    };

    jest
      .spyOn(service, 'create')
      .mockReturnValueOnce(temp)

    jest
      .spyOn(gameRepo, 'save')
      .mockResolvedValueOnce(temp2)

    jest
      .spyOn(gameRepo, 'findOneBy')
      .mockResolvedValueOnce(temp) 

    const g = service.create(gameData); 

    let g2:Game;
    await service.update(g.gid, gameData2).then((res) => g2=res);

    expect(g2).toEqual({ ...gameData2, gid: g2.gid });

  });

  it('should not update because of not found', async () => {

    jest
      .spyOn(gameRepo, 'findOneBy')
      .mockImplementation(() => {throw new NotFoundException})

    try {
      await service.update(100, { name: 'Hello World' });
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundException);
    }
  });

  it('should delete', async () => {

    const temp = {
      gid:1,
      name: 'Tic-tac-toe',
      description: 'A boring game',
      thumbnail: "I don't know",
      url: 'http://localhost:3000',
    };

    jest
      .spyOn(gameRepo, 'find')
      .mockResolvedValue([])

    jest
      .spyOn(service, 'create')
      .mockReturnValueOnce(temp)

    //jest
      //.spyOn(gameRepo, 'findOneBy')
      //.mockResolvedValueOnce(temp) 

    jest
      .spyOn(gameRepo, 'delete')
      .mockResolvedValueOnce(null) 

    let list1:Game[];
    await service.findAll().then((res) => list1 = res);
    const len = list1.length;
    const g = service.create(gameData);
    await service.remove(g.gid);
    let list2:Game[];
    await service.findAll().then((res) => list2 = res);
    const len2 = list2.length;


    expect(len).toBe(len2);

  });
});