import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  uid: number;

  @Column()
  email: string;

  @Column()
  password: string;
}
