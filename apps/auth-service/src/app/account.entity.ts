import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Profile } from './profile.entity';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  uid: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  profile: Profile;

  public MatchPassword(password: string): boolean {
    return this.password == password;
  }
  
}
