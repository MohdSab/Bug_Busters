import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';

@Injectable()
export class GameService {
  games: Game[] = [];

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
    if (this.games.length === 0) newGame.gid = 0;
    else newGame.gid = this.games.at(-1).gid + 1;

    this.games.push(newGame);

    return newGame;
  }

  findAll() {
    return this.games;
  }

  findOne(id: number) {
    for (const game of this.games) if (game.gid === id) return game;

    throw new NotFoundException();
  }

  update(id: number, updateGameDto: UpdateGameDto) {
    for (const game of this.games) {
      if (game.gid === id) {
        if (updateGameDto.name) game.name = updateGameDto.name;

        if (updateGameDto.description)
          game.description = updateGameDto.description;

        if (updateGameDto.thumbnail) game.thumbnail = updateGameDto.thumbnail;

        if (updateGameDto.url) game.url = updateGameDto.url;

        return game;
      }
    }

    throw new NotFoundException();
  }

  remove(id: number) {
    this.games = this.games.filter((game) => game.gid !== id);
    return;
  }
}
