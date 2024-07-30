import {IResponse} from "../../index";
import {MessageEvent, TextEventMessage} from "@line/bot-sdk";
import {ILineBotExternal} from "../../../../domain/interface/externals/lineBotExternal";
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
import {BubbleMessageBuilder} from "../../../../infrastructure/external/line/messageBuilder/bubbleMessageBuilder";
import {
  ICalenderRepository
} from "../../../../domain/interface/repositories/CalenderRepositoryInterface";
import {Email} from "../../../../domain/models/userModel/email";
import {TextMessageBuilder} from "../../../../infrastructure/external/line/messageBuilder/textMessageBuilder";

export class MessageUseCase {
  constructor(
    private lineBot: ILineBotExternal,
    private googleCalenderExternal: IGoogleCalenderExternal,
    private llmModel: ILlmExternal,
    private calenderRepository: ICalenderRepository
  ) {}

  public async execute(event: MessageEvent): Promise<IResponse> {
    const message = event.message as TextEventMessage; // メッセージイベントからテキストメッセージを取得
    const existingUser = await this.calenderRepository.getItem<{user_id: string, calenderId: string}>({ user_id: event.source.userId }); // ユーザーのカレンダーIDを取得

    if (existingUser.calenderId === "") {
      let emailDomain: Email;
      try {
        emailDomain = new Email(message.text); // 入力されたメッセージをメールアドレスとして処理
      } catch (e) {
        // メールアドレスが不正の場合、エラーメッセージを送信
        const errorMessage = new TextMessageBuilder(`カレンダーIDを入力してください。\n\n[Error メッセージ]\n${e}`);
        this.lineBot.replyMessage(event.replyToken, errorMessage);
        return {data: "", status: 400, message: `[ ERROR ] メールアドレスが正しくありません: ${e}`};
      }
      // カレンダーIDをリポジトリに保存
      this.calenderRepository.putItem({user_id: event.source.userId, calenderId: emailDomain.getValue()});

      // 成功メッセージを送信
      const successMessage = new TextMessageBuilder(`カレンダーIDを取得できました。\n\n自然言語で予定を登録できます。\n(例)\n10月4日にOpenAI社のチャットGPTさんと打ち合わせが、14:00から1時間ある`);
      this.lineBot.replyMessage(event.replyToken, successMessage);
      return {data: "", status: 200, message: `メールアドレスの登録に成功しました`};
    }

    // GPTで予定を取得する
    const llmResponse = await this.llmModel.prompt(message.text);

    // 取得したレスポンスをJSONとしてパース
    const outputJson: {
      summary: string,
      description: string,
      location: string,
      startDateTime: string,
      endDateTime: string
    } = JSON.parse(llmResponse.choice.content);

    try {
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
      const errorMessage = new TextMessageBuilder(`正しく入力してください。\n\n[Error メッセージ]\n${e}`);
      this.lineBot.replyMessage(event.replyToken, errorMessage);
      console.log(`[ ERROR ] Message Event: ${e}`);
      return {data: "", status: 400, message: "error"};
    }
  }

  // MessageUseCaseのインスタンスを作成する静的メソッド
  static builder(
    lineBot: ILineBotExternal,
    googleCalenderExternal: IGoogleCalenderExternal,
    llmModel: ILlmExternal,
    calenderRepository: ICalenderRepository
  ): MessageUseCase {
    return new this(lineBot, googleCalenderExternal, llmModel, calenderRepository);
  }
}
