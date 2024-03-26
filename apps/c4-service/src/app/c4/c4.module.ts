import { Module } from '@nestjs/common';
import { Connect4Gateway } from './c4.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connect4 } from './c4.entity';
import { Room } from './room.entity';
import { Connect4Service } from './c4.service';
@Module({
  imports: [TypeOrmModule.forFeature([Connect4, Room])],
  providers: [Connect4Gateway, Connect4Service],
})
export class Connect4Module {}
