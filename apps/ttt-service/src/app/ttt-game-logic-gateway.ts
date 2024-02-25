import { WebSocketGateway, SubscribeMessage, ConnectedSocket, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TicTacToe } from './ttt.entity';


export type NewGameState = {
    roomNumber: number,
    board: string[],
    // currPlayer: number, <- took this out for now cuz i dont think its useful?
    winner: string | null,
    wonBy: number[] | null, // array of length 3 of the indices resulting in the winning play
    validResponse: boolean // if this is false then the function did not do what its supposed to do
}

export type MessageDTO = {
    roomCode: number | null,
    currentPlayer: number,
    move: number | null,
}

// TODO: change to whatever port we end up using
@WebSocketGateway(8000)
export class TicTacToeGameLogic{
    @WebSocketServer()
    server: Server;

    @InjectRepository(TicTacToe)
    private tttRepo: Repository<TicTacToe>,
    
    @SubscribeMessage('move')
    handleMove(@ConnectedSocket() client: Socket, @MessageBody() data: MessageDTO): string{
        /* 
        * Receives move from some player (stored in data), move may be valid/invalid
        * If valid, 
        *   -update
        *       -game state (board) 
        *       -currPlayer
        *   -check for winner
        * If invalid, change nothing
        * 
        * json input data format: 
        * { 
        *   roomCode: room number (String),
        *   currentPlayer: uid,
        *   move: index within board
        * }
        */
        //TODO: IMPLEMENT
        return '';
    }

    @SubscribeMessage('create-room')
    async createRoom(@ConnectedSocket() client: Socket, @MessageBody() data: MessageDTO): Promise<string>{
        try {
            // create a new TTT object and update attributes
            let ttt = new TicTacToe();
            ttt.SetXPlayer(data.currentPlayer);
            await this.tttRepo.save(ttt);
    
            // connect client to the room
            client.join(ttt.roomCode);
    
            // return results
            let payload: NewGameState = {
                board: ttt.board,
                roomNumber: ttt.roomCode,
                winner: ttt.winner,
                wonBy: null,
                validResponse: true
            };
            return JSON.stringify(payload);
        } catch (error) {
            console.error('Error creating a room: oops :(((', error);
        }
    }

    @SubscribeMessage('join-room')
    joinRoom(@ConnectedSocket() client: Socket, @MessageBody() data: MessageDTO): string{
        /* 
        * Join a created room using the room id for the game
        * becomes the oPlayer if oPlayer is null
        * becomes spectator if oPlayer is not null
        * 
        * required data: roomCode, currentPlayer
        */
        try {
            let payload: NewGameState;

            // check if a room with this code exists
            const ttt: TicTacToe = await this.tttRepo.findOne({
                where: { roomCode: data.roomCode },
            });
            if (!ttt) {
                payload.validResponse = false;
                return JSON.stringify(payload);
            }

            // if the room exists, update TTT object and connect client
            // if there is not an oPlayer, the client becomes the oPlater
            // otherwise they are a specator (no change)
            if (!ttt.oPlayer){
                ttt.SetOPlayer(data.currentPlayer);
                await this.tttRepo.save(ttt);
            }
            client.join(String(ttt.roomCode));

            // return results
            payload.validResponse = true;
            payload.board = ttt.board;
            payload.roomNumber = ttt.roomCode;
            payload.winner = ttt.winner;
            payload.wonBy = null;
            return JSON.stringify(payload);
        } catch (error) {
            console.error('Error joining a room', error);
        }
    }

    @SubscribeMessage('replay')
    handleReplay(@ConnectedSocket() client: Socket, @MessageBody() data: MessageDTO): string{
        /* 
        * Reset game state, winner, currPlayer, and board
        * room code will be kept the same
        * 
        * required data: none
        */
        //TODO: IMPLEMENT
        return '';
    }

    @SubscribeMessage('disconnect')
    handleDisconnect(@ConnectedSocket() client: Socket, @MessageBody() data: MessageDTO): string{
        /* 
        * Upon encountering a disconnect, close the game. The remaining player is considered to have won
        * 
        * required data: roomCode, currentPlayer (remaining player)
        * }
        */
        //TODO: IMPLEMENT
        return '';
    }
}