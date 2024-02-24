import { Injectable } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
// import { TicTacToe } from './ttt.entity';

type NewGameState = {
    roomNumber: number,
    board: string[],
    currPlayer: number,
    winner: number | null,
    wonBy: number[] | null //array of length 3 of the indices resulting in the winning play
}
//NOTE: not sure if this is right lol
@WebSocketGateway(8000)
export class TicTacToeGameLogic{
    
    @SubscribeMessage('move')
    handleMove(@MessageBody() data: string): string{
        /* 
        * Receives move from some player (stored in data), move may be valid/invalid
        * If valid, 
        *   -update
        *       -game state (board) 
        *       -currPlayer
        *   -check for winner
        * If invalid, change nothing
        * 
        * json data format: 
        * { 
        *   roomCode: room number,
        *   currentPlayer: uid,
        *   move: index within board
        * }
        */
        //TODO: IMPLEMENT
        return '';
    }

    @SubscribeMessage('create-room')
    createRoom(@MessageBody() data: string): string{
        /* 
        * Creates a room and designates a unique room id for this game
        * only player 1 uid is here (will be xPlayer)
        * 
        * json data format: 
        * {
        *   currentPlayer: uid
        * }
        */
        //TODO: IMPLEMENT
        return '';
    }

    @SubscribeMessage('join-room')
    joinRoom(@MessageBody() data: string): string{
        /* 
        * Join a created room using the room id for the game
        * becomes the oPlayer if oPlayer is null
        * becomes spectator if oPlayer is not null
        * 
        * json data format: 
        * {
        *   roomCode: room number,
        *   currentPlayer: uid
        * }
        */
        //TODO: IMPLEMENT
        return '';
    }

    @SubscribeMessage('replay')
    handleReplay(@MessageBody() data: string): string{
        /* 
        * Reset game state, winner, currPlayer, and board
        * no data needed, room code will be kept the same
        */
        //TODO: IMPLEMENT
        return '';
    }

    @SubscribeMessage('disconnect')
    handleDisconnect(@MessageBody() data: string): string{
        /* 
        * Upon encountering a disconnect, close the game. The remaining player is considered to have won
        * 
        * json data format: 
        * {
        *   roomCode: room number,
        *   currentPlayer: uid of remaining player
        * }
        */
        //TODO: IMPLEMENT
        return '';
    }
}