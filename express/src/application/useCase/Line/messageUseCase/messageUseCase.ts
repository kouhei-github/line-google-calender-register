import {IResponse} from "../../index";
import {MessageEvent, TextEventMessage} from "@line/bot-sdk";
import {ILineBotExternal} from "../../../../domain/interface/externals/line/lineBotExternal";
import {TextMessageBuilder} from "../../../../infrastructure/external/line/messageBuilder/textMessageBuilder";

export class MessageUseCase {
  constructor(private lineBot: ILineBotExternal) {
  }

  public async execute(event: MessageEvent): Promise<IResponse>
  {
    const message = event.message as TextEventMessage
    const textConverter = TextMessageBuilder.builder(message.text)

    this.lineBot.replyMessage(event.replyToken, textConverter)

    return {data: "メッセージの送信完了", status: 200, message: "メッセージの送信完了"}
  }

  static builder(lineBot: ILineBotExternal): MessageUseCase
  {
    return new this(lineBot)
  }
}