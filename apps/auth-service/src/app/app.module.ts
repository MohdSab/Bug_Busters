import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { AccountRepo } from './account.repo';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'root',
      password: 'root',
      database: 'test',
      entities: [Account],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Account]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
