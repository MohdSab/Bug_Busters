import { 
    Body,
    Controller,
    Post,
    Res,
} from "@nestjs/common";
import { ChatService } from "./chat.service"; // to store/check for created rooms

type CreateRoomDTO = {
    game: string,
    gameRoomID: number
}

@Controller('chat')
export class ChatController{
    
    constructor(private chatService: ChatService) {}

    @Post()
    reserveRoom(@Res() response, @Body() data:CreateRoomDTO): string{
        /*
        Create a chat room for the service whom made this request

        Params:
        response - response object to dynamically determine response code 
        data - JSON containing 
             -  1. game name (used to generate unique chat room code along with the room code)
             -  2. the room code for the game

        Returns:
        return the room code of the chat room
        returns empty string if room was not able to be created successfully
        */

        if(this.chatService.createRoom(data.game + data.gameRoomID.toString())){
            response.status(200).send('Room created successfully');
            return data.game + data.gameRoomID.toString();
        }
        response.status(500).send('Room creation failed, prob my fault');
        return '';
    }
}

