import { before } from 'node:test';
import { ChatService } from './chat.service'
import { BadRequestException } from '@nestjs/common';

describe('ChatService', () => {
    let service: ChatService = new ChatService; 

    beforeAll(() => {
        ChatService.roomCodes = new Map<string, Map<Number, Boolean>>
    })

    describe('createRoom', () => {
        it('should create a room', () => {
            const expected: Map<string, Map<Number, Boolean>> = new Map<string, Map<Number, Boolean>>;
            service.createRoom('gamename1');
            expect(ChatService.roomCodes).toBe(expected);
        })
        it('should fail to create room', () => {
            service.createRoom('gamename1');
            expect(service.createRoom('gamename1')).toBe(false);
        })
    })

    describe('joinRoom', () => {
        it('should join a room', () => {
            service.createRoom('gamename1');
            expect(service.joinRoom(1, 'gamename1')).toBe(true);
        })

        it('should fail to join room', () => {
            expect(service.joinRoom(1, 'gamename1')).toThrow(BadRequestException);
        })
    })
});
