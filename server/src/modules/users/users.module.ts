import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { LogsModule } from '../logs/logs.module';
import { AuthorsController } from './authors.controller';

@Module({
  imports: [LogsModule],
  providers: [UsersService],
  controllers: [UsersController, AuthorsController]
})
export class UsersModule {}
