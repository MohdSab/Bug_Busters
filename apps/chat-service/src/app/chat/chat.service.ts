import { BadRequestException, Injectable } from "@nestjs/common";

@Injectable()
export class ChatService{

    roomCodes:Map<string, Map<Number, Boolean>> = new Map<string, Map<Number, Boolean>>// = new Map<string, string[]>; //map of reserved roomCodes (only operations related to this should be lookups, set, delete)

    getAllRooms(){
        let arr = [];
        this.roomCodes.forEach((val, key) => {
            arr.push(key);
        });
        console.log(arr)
        return arr;
    }

    createRoom(code:string): boolean{
        /*
        Creates a room with the provided room name
        Returns true if valid creation
        */

        if (this.checkRoomExists(code)){
            return false;
        }
        this.roomCodes.set(code, new Map<Number, Boolean>);
        return true;
    }

    joinRoom(uid: number, roomCode: string): string{
        //check if room exists
        if(!this.checkRoomExists(roomCode)){
            throw new BadRequestException('trying to join a room that doesnt exist!!');
        }
        //add user to room
        this.roomCodes.get(roomCode).set(uid, true);
        return roomCode;
    }
    
    leaveAllRooms(uid: number): string[]{
        //list of all rooms that were left
        let roomids: string[] = []
        this.roomCodes.forEach((room, roomid) => {
            room.delete(uid);
            if(room.size === 0){
                this.deleteRoom(roomid);
            }
            roomids.push(roomid);
        })
        return roomids;
    }

    leaveRoom(uid: number, roomCode: string){
        if (this.checkRoomExists(roomCode)){
            const room = this.roomCodes.get(roomCode)
            room.delete(uid);
            if(room.size === 0){
                this.deleteRoom(roomCode);
            }

            return true;
        }
        return false;
    }

    deleteRoom(code:string): boolean{
        return this.roomCodes.delete(code);
    }

    checkUserInRoom(uid: number, code: string): boolean{
        const res = this.roomCodes.get(code).has(uid);
        if(!res){
            throw new BadRequestException("user is NOT in the specified room!!");
        }
        return true;
    }

    checkRoomExists(code:string): boolean{
        return this.roomCodes.has(code);
    }

    ExceptRoomExists(code: string): boolean{
        const exists = this.roomCodes.has(code);
        if(!exists){
            throw new BadRequestException('room doesnt exist!!');
        }   
        return true;
    }
}