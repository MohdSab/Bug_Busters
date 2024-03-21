import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Room } from "./room.entity";
import { Repository } from "typeorm";
import { Connect4 } from "./c4.entity";

@Injectable()
export class Connect4Service {
    constructor(
        @InjectRepository(Room)
        private roomRepo: Repository<Room>,

        @InjectRepository(Connect4)
        private gameRepo: Repository<Connect4>
    ){}

    
}