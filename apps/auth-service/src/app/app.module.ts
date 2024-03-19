import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { JwtModule } from '@nestjs/jwt';
import { Profile } from './profile.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PG_HOST,
      port: Number(process.env.PG_PORT),
      username: process.env.PG_USER,
      password: process.env.PG_PW,
      database: process.env.PG_DB,
      entities: [Account, Profile],
      synchronize: true,
      logging: true,
    }),
    TypeOrmModule.forFeature([Account, Profile]),
    JwtModule.register({
      secret: 'mysecret',
      signOptions: { expiresIn: '600s' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
