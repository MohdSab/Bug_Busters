import { 
    Body,
    Controller,
    Post,
    Get,
    Res,
} from "@nestjs/common";
import { ChatService } from "./chat.service"; // to store/check for created rooms
import { Gateway } from "@bb/gateway-lib";

type CreateRoomDTO = {
    game: string,
    gameRoomID: number
}

const key = process.env.CHAT_SERVICE_KEY || 'chat-service';
const port = Number(process.env.CHAT_SERVICE_PORT) || 4000;

//idk wtf im doing here
const GTWY_HOST = process.env.GATEWAY_HOST || 'localhost';
const GTWY_PORT = process.env.GATEWAY_PORT || '3000'; 

@Controller('chat')
export class ChatController{
    
    constructor(private chatService: ChatService) {
        //register this controller on the apigateway
        
        console.log("attempting to register on gateway");
        new Gateway(`${process.env.GATEWAY_HOST}:${process.env.GATEWAY_PORT}`)
        .RegisterService({
            key: key,
            port: port,
            prefix: 'api'
        }).then((route) => {
            console.log('CHAT SERVICE registered with key', route.key, 'on endpoint', route.endpoint);
        }).catch(console.error);
        

    }

    @Get()
    returnAllRooms(){
        return this.chatService.getAllRooms();
    }

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
        console.log("received request to make room with id", data.gameRoomID, "and game", data.game);
        if(this.chatService.createRoom(data.game + data.gameRoomID)){
            response.status(200).send('Room created successfully');
            return data.game + data.gameRoomID;
        }
        response.status(500).send('Room creation failed, prob my fault');
        return '';
    }
}

