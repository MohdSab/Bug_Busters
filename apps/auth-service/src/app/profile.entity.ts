import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { Account } from './account.entity';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  index: number;

  public GetPicturePath(): string {
    return `/profiles/Avatar_${this.index}.png`;
  }
}
