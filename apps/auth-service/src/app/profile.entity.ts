import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export function GetPicPath(pic: string): string {
  return `/profiles/${pic}`;
}

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  avatar: string;

  public GetPicturePath(): string {
    return GetPicPath(this.avatar);
  }
}
