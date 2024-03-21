import { Injectable } from "@nestjs/common";
@Injectable()
export class ChatService{

    //note: this may not work, according to https://stackoverflow.com/questions/62675276/node-js-access-typescript-static-variable-from-different-files
    //note2: might work, since nestjs modules and providers are singletons by default
    //       you just need to import this in the constructor of the other classes (?)
    
    static roomCodes:Map<string, string[]> = new Map<string, string[]>; //map of reserved roomCodes (only operations related to this should be lookups, set, delete)

    createRoom(code:string): boolean{
        /*
        Creates a room with the provided room name
        Returns true if valid creation, false if invalid creation
        */

        if (this.checkExists(code)){
            return false;
        }
        ChatService.roomCodes.set(code, []);
        return true;
    }

    joinRoom(socketid: string, roomCode: string): boolean{
        ChatService.roomCodes.get(roomCode).push(socketid);
        return true;
    }
    
    deleteRoom(code:string): boolean{
        if (!this.checkExists(code)){
            return false;
        }
        ChatService.roomCodes.delete(code);
        return true;
    }

    checkExists(code:string): boolean{
        return ChatService.roomCodes.has(code);
    }

    
}