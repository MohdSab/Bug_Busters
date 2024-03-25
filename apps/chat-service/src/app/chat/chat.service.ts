import { BadRequestException, Injectable } from "@nestjs/common";

@Injectable()
export class ChatService{

    static roomCodes:Map<string, Map<Number, Boolean>> = new Map<string, Map<Number, Boolean>>// = new Map<string, string[]>; //map of reserved roomCodes (only operations related to this should be lookups, set, delete)

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
        console.log("in chatservice");
        const res = this.checkRoomExists(roomCode);
        console.log("res is", res);
        console.log("map of rooms is", ChatService.roomCodes);
        if(!this.checkRoomExists(roomCode)){
            console.log();
            throw new BadRequestException('trying to join a room that doesnt exist!!');
        }
        //add user to room
        ChatService.roomCodes.get(roomCode).set(uid, true);
        return true;
    }
    
    leaveAllRooms(uid: number): string[]{
        let roomids: string[] = []
        ChatService.roomCodes.forEach((room, roomid) => {
            room.delete(uid);
            roomids.push(roomid);
        })
        return roomids;
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

    checkUserInRoom(uid: number, code: string): boolean{
        const res = ChatService.roomCodes.get(code).has(uid);
        if(!res){
            console.log("user not in room")
            throw new BadRequestException("user is NOT in the specified room!!");
        }
        console.log("just before return statement");
        return true;
    }

    checkRoomExists(code:string): boolean{
        console.log('in function');
        console.log('code is', code);
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