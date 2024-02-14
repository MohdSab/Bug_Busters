import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Profile } from './profile.entity';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  uid: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @OneToOne(() => Profile, { eager: true })
  @JoinColumn()
  profile: Profile;

  @Column()
  isGuest:boolean;

  SetUsername(username: string) {
    this.username = username;
  }

  SetPassword(password: string) {
    this.password = password;
  }

  GetUID() {
    return this.uid;
  }

  public MatchPassword(password: string): boolean {
    return this.password == password;
  }
}
