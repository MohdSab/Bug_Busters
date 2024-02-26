import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { TicTacToe } from './ttt.entity';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true})
  p1?: number;

  @Column({ nullable: true})
  p2?: number;

  @OneToOne(() => TicTacToe, { eager: true })
  @JoinColumn()
  currentGame: TicTacToe;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
