import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Connect4 } from "./c4.entity";

@Entity()
export class Room {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true})
    p1?: number;

    @Column({ nullable: true})
    p2?: number;

    @OneToOne(() => Connect4, { eager: true})
    @JoinColumn()
    currentGame: Connect4;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}