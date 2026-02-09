import { Module } from '@nestjs/common';
import { DbToolsController } from './db-tools.controller';
import { DbToolsService } from './db-tools.service';

@Module({
  controllers: [DbToolsController],
  providers: [DbToolsService]
})
export class DbToolsModule {}
