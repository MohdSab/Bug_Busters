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
  games: Game[] = [];

  constructor(
    @InjectRepository(Game)
    private gameRepo: Repository<Game>,
  ){
    //TODO: perform a one time getAll request from the database to populate the games array
    this.gameRepo.find().then((res) => {this.games = res.slice()});
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
    if (this.games.length === 0) newGame.gid = 0;
    else newGame.gid = this.games.at(-1).gid + 1;

    this.games.push(newGame);

    //TODO: Add game to database
    const newGameDB = this.gameRepo.create({
      gid: this.games.at(-1).gid + 1,
      name: createGameDto.name,
      description: createGameDto.description,
      thumbnail: createGameDto.thumbnail,
      url: createGameDto.url
    });
    this.gameRepo.save(newGameDB);

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

        //TODO: update game in database
        this.gameRepo.save(updateGameDto);

        return game;
      }
    }

    throw new NotFoundException();
  }

  remove(id: number) {
    this.games = this.games.filter((game) => game.gid !== id);

    //TODO: remove game from database
    this.gameRepo.exists({ where: {gid: id}}).then(
      (exists) => {
        if(exists){
          this.gameRepo.delete({gid: id});
        }
    })

    return;
  }
}
