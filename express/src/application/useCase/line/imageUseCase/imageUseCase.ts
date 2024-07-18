import {IResponse} from "../../index";
import {ImageEventMessage, MessageEvent, TextEventMessage} from "@line/bot-sdk";
import {ILineBotExternal} from "../../../../domain/interface/externals/lineBotExternal";
import {IGoogleCalenderExternal} from "../../../../domain/interface/externals/googleCalenderExternal";

export class ImageUseCase {
  constructor(private lineBot: ILineBotExternal, private googleCalenderExternal: IGoogleCalenderExternal) {
  }

  public async execute(event: MessageEvent): Promise<IResponse>
  {
    const message = event.message as ImageEventMessage
    const stream = await this.lineBot.getImageContent(event.message.id);

    // OPEN AIに投げてOCR

    return {data: "メッセージの送信完了", status: 200, message: "メッセージの送信完了"}
  }


  static builder(lineBot: ILineBotExternal, googleCalender: IGoogleCalenderExternal): ImageUseCase
  {
    return new this(lineBot, googleCalender)
  }
}