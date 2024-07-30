import {IResponse} from "../../index";
import {ImageEventMessage, MessageEvent, TextEventMessage} from "@line/bot-sdk";
import {ILineBotExternal} from "../../../../domain/interface/externals/lineBotExternal";
import {IGoogleCalenderExternal} from "../../../../domain/interface/externals/googleCalenderExternal";
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
import {
  ICalenderRepository
} from "../../../../domain/interface/repositories/CalenderRepositoryInterface";
import {TextMessageBuilder} from "../../../../infrastructure/external/line/messageBuilder/textMessageBuilder";

export class ImageUseCase {
  constructor(
    private lineBot: ILineBotExternal,
    private googleCalenderExternal: IGoogleCalenderExternal,
    private llmModel: ILlmExternal,
    private calenderRepository: ICalenderRepository
  ) {}

  public async execute(event: MessageEvent): Promise<IResponse> {
    // ユーザーのカレンダーIDを取得
    const existingUser = await this.calenderRepository.getItem<{user_id: string, calenderId: string}>({ user_id: event.source.userId });
    if (existingUser.calenderId === "") {
      // カレンダーIDが未設定の場合、エラーメッセージを送信
      const errorMessage = new TextMessageBuilder(`カレンダーIDをテキストで入力してください。`);
      this.lineBot.replyMessage(event.replyToken, errorMessage);
      return {data: "", status: 400, message: `[ ERROR ] カレンダーIDをテキストで入力してください`};
    }

    // 画像コンテンツを取得
    const base64Image = await this.lineBot.getImageContent(event.message.id);

    // 画像をOCRに投げてテキストを取得
    const llmResponse = await this.llmModel.ocr(base64Image);

    try {
      // OCRの結果をパースして予定情報を取得
      const outputJson: {
        summary: string,
        description: string,
        location: string,
        startDateTime: string,
        endDateTime: string
      } = JSON.parse(llmResponse.choice.content);

      // 開始日時と終了日時のドメインモデルを作成
      const startDateDomain = new StartDateTime(outputJson.startDateTime);
      const endDateDomain = new EndDateTime(outputJson.endDateTime);

      // 日付エンティティの作成
      const datetimeEntity = new DateTimeEntity(startDateDomain, endDateDomain);

      // 開始日時が終了日時より早いか確認
      datetimeEntity.validateCurrentTime();

      // その他のドメインモデルを作成
      const summaryDomain = new Summary(outputJson.summary);
      const descriptionDomain = new Description(outputJson.description);
      const locationDomain = new Location(outputJson.location);
      const timeZoneDomain = new TimeZone("Asia/Tokyo");

      // カレンダーエンティティの作成
      const calenderEntity = new CalenderEntity(summaryDomain, descriptionDomain, locationDomain, timeZoneDomain, datetimeEntity);

      // Google カレンダーにイベントを登録
      const myEvent = await this.googleCalenderExternal.createEventWithMeetLink(existingUser.calenderId, calenderEntity);

      // バブルメッセージを作成
      const bubbleMessage = BubbleMessageBuilder.GoogleRegisterUI(myEvent.htmlLink ?? "", calenderEntity);

      // バブルメッセージを変換
      const bubbleConverter = BubbleMessageBuilder.builder(bubbleMessage);

      // LINEボットでメッセージを返信
      this.lineBot.replyMessage(event.replyToken, bubbleConverter);

      return {data: "メッセージの送信完了", status: 200, message: "メッセージの送信完了"};
    } catch (e) {
      // エラーメッセージを作成して送信
      const errorMessage = new TextMessageBuilder(`画像に以下が含まれるか確認してください。\n\n[Error メッセージ]\n${e}`);
      this.lineBot.replyMessage(event.replyToken, errorMessage);
      console.log(`[ ERROR ] Message Event: ${e}`);
      return {data: "", status: 400, message: "error"};
    }
  }

  // ImageUseCaseのインスタンスを作成する静的メソッド
  static builder(
    lineBot: ILineBotExternal,
    googleCalender: IGoogleCalenderExternal,
    llmModel: ILlmExternal,
    calenderRepository: ICalenderRepository
  ): ImageUseCase {
    return new this(lineBot, googleCalender, llmModel, calenderRepository);
  }
}
