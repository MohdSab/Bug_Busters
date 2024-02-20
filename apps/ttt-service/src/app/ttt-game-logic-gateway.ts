import { Injectable } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

type NewGameState = {
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
        */
        //TODO: IMPLEMENT
        return '';
    }

    @SubscribeMessage('room')
    handleRoom(@MessageBody() data: string): string{
        /* 
        * Creates a room for exactly two unique users, designates a unique room id for this game
        *
        * 
        */
        //TODO: IMPLEMENT
        return '';
    }

    @SubscribeMessage('replay')
    handleReplay(@MessageBody() data: string): string{
        /* 
        * Reset game state, winner, currPlayer, and board
        *
        * 
        */
        //TODO: IMPLEMENT
        return '';
    }

    @SubscribeMessage('disconnect')
    handleDisconnect(@MessageBody() data: string): string{
        /* 
        * Upon encountering a disconnect, close the game. The remaining player is considered to have won
        * 
        * 
        */
        //TODO: IMPLEMENT
        return '';
    }
}