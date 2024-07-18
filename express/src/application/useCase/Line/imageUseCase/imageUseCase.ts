import {IResponse} from "../../index";
import {MessageEvent} from "@line/bot-sdk";
import {ILineBotExternal} from "../../../../domain/interface/externals/line/lineBotExternal";

export class ImageUseCase {
  constructor(private lineBot: ILineBotExternal) {
  }

  public async execute(event: MessageEvent): Promise<IResponse>
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

    return {data: "", status: 400, message: "すでに存在するメールアドレスです"}
  }

  static builder(lineBot: ILineBotExternal): ImageUseCase
  {
    return new this(lineBot)
  }
}