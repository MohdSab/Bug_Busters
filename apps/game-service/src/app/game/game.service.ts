import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class GameService {
  // games: Game[] = [];

  constructor(
    @InjectRepository(Game)
    private gameRepo: Repository<Game>
  ) {
    //TODO: perform a one time getAll request from the database to populate the games array
    // this.gameRepo.find().then((res) => {
    //   this.games = res.slice();
    // });
  }

  create(createGameDto: CreateGameDto) {
    if (
      !createGameDto.description ||
      !createGameDto.name ||
      !createGameDto.thumbnail ||
      !createGameDto.url
    )
      throw new BadRequestException();

    const newGame = new Game();
    newGame.name = createGameDto.name;
    newGame.description = createGameDto.description;
    newGame.thumbnail = createGameDto.thumbnail;
    newGame.url = createGameDto.url;
    // if (this.games.length === 0) newGame.gid = 0;
    // else newGame.gid = this.games.at(-1).gid + 1;

    // this.games.push(newGame);

    //TODO: Add game to database
    const newGameDB = this.gameRepo.create({
      // gid: this.games.at(-1).gid + 1,
      name: createGameDto.name,
      description: createGameDto.description,
      thumbnail: createGameDto.thumbnail,
      url: createGameDto.url,
    });
    this.gameRepo.save(newGameDB);

    return newGame;
  }

  findAll() {
    return this.gameRepo.find();
  }

  findOne(id: number) {
    // for (const game of this.games) if (game.gid === id) return game;
    return this.gameRepo.findOneBy({ gid: id });
  }

  async update(id: number, updateGameDto: UpdateGameDto) {
    const game = await this.findOne(id);
    if (!game) throw new NotFoundException();

    if (updateGameDto.name) game.name = updateGameDto.name;
    if (updateGameDto.description) game.name = updateGameDto.description;
    if (updateGameDto.thumbnail) game.name = updateGameDto.thumbnail;
    if (updateGameDto.url) game.name = updateGameDto.url;

    return this.gameRepo.save(game);
  }

  remove(id: number) {
    return this.gameRepo.delete(id);
  }
}
