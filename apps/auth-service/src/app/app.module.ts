import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { JwtModule } from '@nestjs/jwt';
import { Profile } from './profile.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'root',
      password: 'root',
      database: 'test',
      entities: [Account, Profile],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Account, Profile]),
    JwtModule.register({
      secret: "mysecret",
      signOptions: { expiresIn: "600s" },
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
