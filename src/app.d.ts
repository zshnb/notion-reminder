import { CreatePageParameters } from '@notionhq/client/build/src/api-endpoints'

export type ReminderItem = {
  title: string
  list: string
  priority: string
  alertDate?: string
  status: string
  note?: string
  url?: string
}

export type ValueOf<T> = T[keyof T]
export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never

type DateRequest = NonNullable<
  NonNullable<
    Extract<
      ValueOf<CreatePageParameters['properties']>,
      { type?: 'date' }
    >['date']
  >
>
export type TimeZoneRequest = DateRequest['time_zone']

export type EmojiRequest = Extract<
  CreatePageParameters['icon'],
  { type?: 'emoji' }
>['emoji']

export type TitleRequest = NonNullable<
  NonNullable<
    Extract<
      ValueOf<CreatePageParameters['properties']>,
      { type?: 'title' }
    >['title']
  >
>

export type SelectRequest = NonNullable<
  NonNullable<
    Extract<
      ValueOf<CreatePageParameters['properties']>,
      { type?: 'select' }
    >['select']
  >
>

export type UrlRequest = NonNullable<
  NonNullable<
    Extract<
      ValueOf<CreatePageParameters['properties']>,
      { type?: 'url' }
    >['url']
  >
>

export type StatusRequest = NonNullable<
  NonNullable<
    Extract<
      ValueOf<CreatePageParameters['properties']>,
      { type?: 'status' }
    >['status']
  >
>

export type RichTextRequest = NonNullable<
  NonNullable<
    Extract<
      ValueOf<CreatePageParameters['properties']>,
      { type?: 'rich_text' }
    >['rich_text']
  >
>

export type WithAuth = {
  secretKey: string
  databaseId: string
}

export type SyncRemindersRequest = WithAuth & {
  json: string
}
