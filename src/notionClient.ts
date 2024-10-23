import { Injectable } from '@nestjs/common'
import { Client } from '@notionhq/client'
import {
  DateRequest,
  RichTextRequest,
  SelectRequest,
  StatusRequest,
  TitleRequest,
  UrlRequest
} from './app'

@Injectable()
export class NotionClient {
  private client: Client

  constructor() {}

  newClient(auth: string) {
    this.client = new Client({
      auth
    })
  }

  createTitleProperty(text: string): {
    type: 'title'
    title: TitleRequest
  } {
    return {
      type: 'title',
      title: [
        {
          type: 'text',
          text: {
            content: text
          }
        }
      ]
    }
  }

  createSelectProperty(name: string): {
    type: 'select'
    select: SelectRequest
  } {
    return {
      type: 'select',
      select: {
        name
      }
    }
  }

  createStatusProperty(name: string): {
    type: 'status'
    status: StatusRequest
  } {
    return {
      type: 'status',
      status: {
        name
      }
    }
  }

  createDateProperty(text?: string):
    | {
        type: 'date'
        date: DateRequest
      }
    | undefined {
    if (!text) return undefined
    return {
      type: 'date',
      date: {
        start: text
      }
    }
  }

  createUrlProperty(url?: string):
    | {
        type: 'url'
        url: UrlRequest
      }
    | undefined {
    if (!url) return undefined
    return {
      type: 'url',
      url
    }
  }

  createRichTextProperty(text: string):
    | {
        type: 'rich_text'
        rich_text: RichTextRequest
      }
    | undefined {
    if (!text) return undefined
    return {
      type: 'rich_text',
      rich_text: [
        {
          text: {
            content: text
          }
        }
      ]
    }
  }

  get innerClient(): Client {
    return this.client
  }
}
