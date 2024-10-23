import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { NotionClient } from './notionClient'

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, NotionClient]
})
export class AppModule {}
