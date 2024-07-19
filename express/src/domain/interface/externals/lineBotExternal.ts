import { Message } from "@line/bot-sdk";

export interface ILineConverter {
  convert():  Message | Message[]
}

export interface ILineBotExternal {
  replyMessage(replyToken: string, converter: ILineConverter): void
  pushMessage(lineUserId: string, converter: ILineConverter): void
  getImageContent(messageId: string): Promise<string>
  getAudioContent(messageId: string): Promise<File>
}
