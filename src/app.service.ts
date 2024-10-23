import { Injectable, Logger } from '@nestjs/common'
import { ReminderItem, WithAuth } from './app'
import { partition } from 'lodash'
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import { NotionClient } from './notionClient'
import { cleanObject } from './util'

@Injectable()
export class AppService {
  private readonly logger: Logger = new Logger('AppService')
  constructor(private readonly notionClient: NotionClient) {}

  async syncReminders(auth: WithAuth, items: ReminderItem[]) {
    this.notionClient.newClient(auth.secretKey)
    const pages = await this.notionClient.innerClient.databases.query({
      database_id: auth.databaseId,
      filter: {
        type: 'status',
        property: 'Status',
        status: {
          does_not_equal: 'Done'
        }
      }
    })

    function getPriority(priority: string) {
      switch (priority) {
        case 'High':
        case '高':
          return '高'
        case 'Medium':
        case '中':
          return '中'
        case 'Low':
        case '低':
          return '低'
        case 'None':
        case '无':
          return '无'
      }
    }

    function getStatus(status: string) {
      switch (status) {
        case 'Yes':
        case '是': {
          return 'Done'
        }
        default: {
          return 'ToDo'
        }
      }
    }
    const [newItems, existItems] = partition(items, (it: ReminderItem) => {
      return (
        pages.results.find((page: PageObjectResponse) => {
          const title = page.properties['名称']
          if (title.type === 'title') {
            const titleText = title.title[0].plain_text
            return it.title === titleText
          } else {
            return false
          }
        }) === undefined
      )
    })

    const createNewReminders = async () => {
      for (const item of newItems) {
        const properties = {
          '名称': this.notionClient.createTitleProperty(item.title),
          '事项列表': this.notionClient.createSelectProperty(item.list),
          '提醒日期': this.notionClient.createDateProperty(item.alertDate),
          '优先级': this.notionClient.createSelectProperty(
            getPriority(item.priority)
          ),
          'URL': this.notionClient.createUrlProperty(item.url),
          'Status': this.notionClient.createStatusProperty(
            getStatus(item.status)
          ),
          '备注': this.notionClient.createRichTextProperty(item.note)
        }

        await this.notionClient.innerClient.pages.create({
          parent: {
            type: 'database_id',
            database_id: auth.databaseId
          },
          properties: cleanObject(properties)
        })
      }
    }

    const updateExistingReminders = async () => {
      for (const item of existItems) {
        const page = pages.results.find((it: PageObjectResponse) => {
          const title = it.properties['名称']
          if (title.type === 'title') {
            return title.title[0].plain_text === item.title
          }
          return false
        })
        if (!page) {
          continue
        }
        const properties = {
          '名称': this.notionClient.createTitleProperty(item.title),
          '事项列表': this.notionClient.createSelectProperty(item.list),
          '提醒日期': this.notionClient.createDateProperty(item.alertDate),
          '优先级': this.notionClient.createSelectProperty(
            getPriority(item.priority)
          ),
          'URL': this.notionClient.createUrlProperty(item.url),
          'Status': this.notionClient.createStatusProperty(
            getStatus(item.status)
          ),
          '备注': this.notionClient.createRichTextProperty(item.note)
        }

        await this.notionClient.innerClient.pages.update({
          page_id: page.id,
          properties: cleanObject(properties)
        })
      }
    }

    await Promise.all([createNewReminders(), updateExistingReminders()])
    this.logger.log(
      `sync done, new reminders: ${newItems.length}, update reminders: ${existItems.length}`
    )
  }
}
