import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connect4Module } from './c4/c4.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'root',
      password: 'root',
      database: 'c4',
      autoLoadEntities: true,
      synchronize: true,
      logging: true
    }),
    Connect4Module
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
