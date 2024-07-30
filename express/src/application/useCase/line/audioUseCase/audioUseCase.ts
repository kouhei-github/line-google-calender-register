import {IResponse} from "../../index";
import {AudioEventMessage, AudioMessage, MessageEvent, PostbackEvent, WebhookRequestBody} from "@line/bot-sdk";
import {ILineBotExternal} from "../../../../domain/interface/externals/lineBotExternal";
import {ILlmExternal} from "../../../../domain/interface/externals/llmExternal";
import {StartDateTime} from "../../../../domain/models/calenderModel/startDateTime";
import {EndDateTime} from "../../../../domain/models/calenderModel/endDateTime";
import {DateTimeEntity} from "../../../../domain/models/calenderModel/dateTimeEntity";
import {Summary} from "../../../../domain/models/calenderModel/summary";
import {Description} from "../../../../domain/models/calenderModel/description";
import {Location} from "../../../../domain/models/calenderModel/location";
import {TimeZone} from "../../../../domain/models/calenderModel/timeZone";
import {CalenderEntity} from "../../../../domain/models/calenderModel/calenderEntity";
import {BubbleMessageBuilder} from "../../../../infrastructure/external/line/messageBuilder/bubbleMessageBuilder";
import {IGoogleCalenderExternal} from "../../../../domain/interface/externals/googleCalenderExternal";
import {
  ICalenderRepository,
} from "../../../../domain/interface/repositories/CalenderRepositoryInterface";
import {Email} from "../../../../domain/models/userModel/email";
import {TextMessageBuilder} from "../../../../infrastructure/external/line/messageBuilder/textMessageBuilder";

export class AudioUseCase {
  constructor(
    private lineBot: ILineBotExternal,
    private llmModel: ILlmExternal,
    private googleCalender: IGoogleCalenderExternal,
    private calenderRepository: ICalenderRepository
  ) {
  }

  public async execute(event: MessageEvent): Promise<IResponse>
  {
    const message = event.message as AudioEventMessage

    const existingUser = await this.calenderRepository.getItem<{user_id: string, calenderId: string}>({ user_id: event.source.userId })
    if (existingUser.calenderId === "") {
      const errorMessage = new TextMessageBuilder(`カレンダーIDをテキストで入力してください。`)
      this.lineBot.replyMessage(event.replyToken, errorMessage)
      return {data: "", status: 400, message: `[ ERROR ] カレンダーIDをテキストで入力してください`}
    }

    const file =　await this.lineBot.getAudioContent(message.id)

    //
    const audioText = await this.llmModel.audio(file)
    // GPTで予定を取得する
    const llmResponse = await this.llmModel.prompt(audioText)

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
      const myEvent = await this.googleCalender.createEventWithMeetLink(
        existingUser.calenderId,
        calenderEntity
      )

      const bubbleMessage = BubbleMessageBuilder.GoogleRegisterUI(myEvent.htmlLink ?? "", calenderEntity)

      const bubbleConverter = BubbleMessageBuilder.builder(bubbleMessage)

      this.lineBot.replyMessage(event.replyToken, bubbleConverter)

      return {data: "メッセージの送信完了", status: 200, message: "メッセージの送信完了"}
    } catch (e) {
      const errorMessage = new TextMessageBuilder(`正しく音声入力してください。\n\n[Error メッセージ]\n${e}`)
      this.lineBot.replyMessage(event.replyToken, errorMessage)
      console.log(`[ ERROR ] Message Event: ${e}`)
      return {data: "", status: 400, message: "error"}
    }
  }

  static builder(
    lineBot: ILineBotExternal,
    llmExternal: ILlmExternal,
    googleCalender: IGoogleCalenderExternal,
    calenderRepository: ICalenderRepository,
  ): AudioUseCase
  {
    return new this(lineBot, llmExternal, googleCalender, calenderRepository)
  }
}