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
      host: process.env.PG_HOST || 'localhost',
      port: Number(process.env.PG_PORT || 5432),
      username: process.env.PG_USER || 'auth',
      password: process.env.PG_PW || 'auth',
      database: process.env.PG_DB || 'auth',
      autoLoadEntities: true,
      synchronize: true,
      logging: process.env.NODE_ENV === 'development',
    }),
    TypeOrmModule.forFeature([Account, Profile]),
    JwtModule.register({
      secret: 'mysecret',
      signOptions: { expiresIn: '60000s' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
