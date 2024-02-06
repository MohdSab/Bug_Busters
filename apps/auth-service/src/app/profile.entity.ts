import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
