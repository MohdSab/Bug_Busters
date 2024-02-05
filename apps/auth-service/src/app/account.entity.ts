import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Profile } from './profile.entity';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  uid: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @OneToOne(() => Profile, p => p.id, { eager: true })
  @JoinColumn()
  profile: Profile;

  SetUsername(username: string) {
    this.username = username;
  }

  SetPassword(password: string) {
    this.password = password;
  }

  public MatchPassword(password: string): boolean {
    return this.password == password;
  }
  
}
