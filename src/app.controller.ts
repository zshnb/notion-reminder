import { Body, Controller, Logger, Post } from '@nestjs/common'
import { AppService } from './app.service'
import { ReminderItem, SyncRemindersRequest } from './app'

@Controller('reminders')
export class AppController {
  private readonly logger = new Logger('AppController')
  constructor(private readonly appService: AppService) {}

  @Post('sync')
  syncReminders(@Body() request: SyncRemindersRequest): string {
    this.logger.log('sync reminders')
    let jsonStr = request.json.slice(1)
    jsonStr = `[${jsonStr}]`
    const items = JSON.parse(jsonStr) as ReminderItem[]
    this.appService.syncReminders({ ...request }, items)
    return 'success'
  }
}
