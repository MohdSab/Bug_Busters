import { Injectable } from "@nestjs/common";

@Injectable()
export class ChatService{
    createRoom(){
        /*
        Creates new room then returns the corresponding code
        note: do we use a db?
                if so, do we wish to have two tables, one for the rooms, one for the users connected to which room?
                note2: for rooms table, is it desirable to have a column representing game+code as an alternative unique identifier?
        */
    }
}