import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Route {
  @PrimaryColumn()
  key: string;

  @Column()
  ip: string;

  @Column()
  port: number;

  @Column({ default: '' })
  prefix: string;
}
