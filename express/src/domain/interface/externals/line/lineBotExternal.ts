import {Message} from "@line/bot-sdk";

export interface ILineBotExternal {
  greetingMessage(replyToken: string): void
  replyMessage(replyToken: string, message: Message | Message[]): void
  pushMessage(lineUserId: string, message:  Message | Message[]): void
}