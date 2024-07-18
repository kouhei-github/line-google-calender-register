import {IResponse} from "../../index";
import {FollowEvent} from "@line/bot-sdk";
import {ILineBotExternal} from "../../../../domain/interface/externals/line/lineBotExternal";

export class FollowUseCase {
  constructor(private lineBot: ILineBotExternal) {
  }

  public async execute(event: FollowEvent): Promise<IResponse>
  {
    /**
     * [初期設定]
     * 使い方の説明を記載する
     * このメールアドレスをGoogleカレンダーに追加してください。
     * 追加の仕方は下記を参考ください。
     *
     * [予定の登録仕方]
     * 2024年の8月2日に永松さんと14時から打ち合わせがあるから予定を追加して。
     * Google MeetsのURLも発行して
     */
    try {
      const replyToken = event.replyToken;
      this.lineBot.greetingMessage(replyToken)
    } catch(e) {
      console.log(`[ ERROR ] Follow Event: ${e}`)
      return {data: "", status: 400, message: `[ ERROR ] Follow Event: ${e}`}
    }

    return {data: "", status: 200, message: "挨拶メッセージの送信完了"}
  }

  static builder(lineBot: ILineBotExternal): FollowUseCase
  {
    return new this(lineBot)
  }
}
