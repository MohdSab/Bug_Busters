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

@Controller("chat")
export class ChatController{
    
    constructor(private chatService: ChatService) {}

    @Post()
    reserveRoom(@Res() response, @Body() data:CreateRoomDTO): string{
        /*
        Create a chat room for the service whom made this request

        Params:
        response - response code to the requesting service
        data - JSON containing 

        Returns:
        return the room code of the chat room
        returns empty string if room was not able to be created successfully
        */

        if(this.chatService.createRoom(data.game + data.gameRoomID.toString())){
            //TODO a: set response to something good :steamhappy:
            return data.game + data.gameRoomID.toString();
        }
        //TODO b: set response code to something bad :sob:
        return '';
    }
}

