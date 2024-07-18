import {IResponse} from "../../index";
import {MessageEvent, TextEventMessage} from "@line/bot-sdk";
import {ILineBotExternal} from "../../../../domain/interface/externals/lineBotExternal";
import {TextMessageBuilder} from "../../../../infrastructure/external/line/messageBuilder/textMessageBuilder";
import {IGoogleCalenderExternal} from "../../../../domain/interface/externals/googleCalenderExternal";

export class MessageUseCase {
  constructor(private lineBot: ILineBotExternal, private googleCalenderExternal: IGoogleCalenderExternal) {
  }

  public async execute(event: MessageEvent): Promise<IResponse>
  {
    const message = event.message as TextEventMessage
    const textConverter = TextMessageBuilder.builder(message.text)

    // Google Calender登録
    this.googleCalenderExternal.createEventWithMeetLink(
      "kohei0801nagamatsu@gmail.com",
      'テストイベント (Meet あり)',
      'conferenceDataVersion: 0 のテスト',
      "online",
      '2024-07-20T10:00:00+09:00',
      '2024-07-20T11:00:00+09:00',
      true,
      'Asia/Tokyo',
    )

    this.lineBot.replyMessage(event.replyToken, textConverter)

    return {data: "メッセージの送信完了", status: 200, message: "メッセージの送信完了"}
  }

  static builder(lineBot: ILineBotExternal, googleCalenderExternal: IGoogleCalenderExternal): MessageUseCase
  {
    return new this(lineBot, googleCalenderExternal)
  }
}