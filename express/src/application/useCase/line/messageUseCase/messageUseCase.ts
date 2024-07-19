import {IResponse} from "../../index";
import {MessageEvent, TextEventMessage} from "@line/bot-sdk";
import {ILineBotExternal} from "../../../../domain/interface/externals/lineBotExternal";
import {TextMessageBuilder} from "../../../../infrastructure/external/line/messageBuilder/textMessageBuilder";
import {IGoogleCalenderExternal} from "../../../../domain/interface/externals/googleCalenderExternal";
import {ILlmExternal} from "../../../../domain/interface/externals/llmExternal";
import {StartDateTime} from "../../../../domain/models/calenderModel/startDateTime";
import {DateTimeEntity} from "../../../../domain/models/calenderModel/dateTimeEntity";
import {CalenderEntity} from "../../../../domain/models/calenderModel/calenderEntity";
import {Summary} from "../../../../domain/models/calenderModel/summary";
import {Description} from "../../../../domain/models/calenderModel/description";
import {TimeZone} from "../../../../domain/models/calenderModel/timeZone";
import {Location} from "../../../../domain/models/calenderModel/location";
import {EndDateTime} from "../../../../domain/models/calenderModel/endDateTime";
import {FlexMessageConverter} from "../../../../infrastructure/external/line/messageBuilder/flexMessageBuilder";
import {BubbleMessageBuilder} from "../../../../infrastructure/external/line/messageBuilder/bubbleMessageBuilder";

export class MessageUseCase {
  constructor(
    private lineBot: ILineBotExternal,
    private googleCalenderExternal: IGoogleCalenderExternal,
    private llmModel: ILlmExternal
  ) {
  }

  public async execute(event: MessageEvent): Promise<IResponse>
  {
    const message = event.message as TextEventMessage
    // GPTで予定を取得する
    const llmResponse = await this.llmModel.prompt(message.text)

    const outputJson: {
      summary: string,
      description: string,
      location: string,
      startDateTime: string,
      endDateTime: string
    } = JSON.parse(llmResponse.choice.content)

    try {
      const startDateDomain = new StartDateTime(outputJson.startDateTime)
      const endDateDomain = new EndDateTime(outputJson.endDateTime)

      // 日付エンティティの作成
      const datetimeEntity = new DateTimeEntity(startDateDomain, endDateDomain)

      // 開始日時が終了日時より早いか確認
      datetimeEntity.validateCurrentTime()

      const summaryDomain = new Summary(outputJson.summary)
      const descriptionDomain = new Description(outputJson.description)
      const locationDomain = new Location(outputJson.location)
      const timeZoneDomain = new TimeZone("Asia/Tokyo")
      // カレンダーエンティティの作成
      const calenderEntity = new CalenderEntity(
        summaryDomain, descriptionDomain, locationDomain, timeZoneDomain, datetimeEntity)

      // Google Calender登録
      const myEvent = await this.googleCalenderExternal.createEventWithMeetLink(
        "kohei0801nagamatsu@gmail.com",
        calenderEntity
      )

      console.log(myEvent.htmlLink)
      console.log(myEvent.hangoutLink)

      const bubbleMessage = BubbleMessageBuilder.GoogleRegisterUI(myEvent.htmlLink ?? "", calenderEntity)

      const bubbleConverter = BubbleMessageBuilder.builder(bubbleMessage)

      this.lineBot.replyMessage(event.replyToken, bubbleConverter)

      return {data: "メッセージの送信完了", status: 200, message: "メッセージの送信完了"}
    } catch (e) {
      console.log(`[ ERROR ] Message Event: ${e}`)
      return {data: "", status: 400, message: "error"}

    }

  }

  static builder(
    lineBot: ILineBotExternal,
    googleCalenderExternal: IGoogleCalenderExternal,
    llmModel: ILlmExternal
  ): MessageUseCase {
    return new this(lineBot, googleCalenderExternal, llmModel)
  }
}