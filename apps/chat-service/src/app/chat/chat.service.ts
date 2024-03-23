import { BadRequestException, Injectable } from "@nestjs/common";

@Injectable()
export class ChatService{

    static roomCodes:Map<String, Map<Number, Boolean>> = new Map<String, Map<Number, Boolean>>// = new Map<string, string[]>; //map of reserved roomCodes (only operations related to this should be lookups, set, delete)

    createRoom(code:string): boolean{
        /*
        Creates a room with the provided room name
        Returns true if valid creation
        */

        if (this.checkRoomExists(code)){
            return false;
        }
        ChatService.roomCodes.set(code, new Map<Number, Boolean>);
        return true;
    }

    joinRoom(uid: number, roomCode: string): boolean{
        //check if room exists
        if(this.checkRoomExists(roomCode)){
            throw new BadRequestException('trying to join a room that doesnt exist!!');
        }
        //add user to room
        ChatService.roomCodes.get(roomCode).set(uid, true);
        return true;
    }
    
    leaveAllRooms(uid: number){
        ChatService.roomCodes.forEach((room) => {
            room.delete(uid);
        })
    }

    leaveRoom(uid: number, roomCode: string){
        if (this.checkRoomExists(roomCode)){
            return ChatService.roomCodes.get(roomCode).delete(uid);
        }
        return false;
    }

    deleteRoom(code:string): boolean{
        return ChatService.roomCodes.delete(code);
    }

    checkRoomExists(code:string): boolean{
        return ChatService.roomCodes.has(code);
    }

    ExceptRoomExists(code: string): boolean{
        const exists = ChatService.roomCodes.has(code);
        if(!exists){
            throw new BadRequestException('room exists!!');
        }   
        return true;
    }
}