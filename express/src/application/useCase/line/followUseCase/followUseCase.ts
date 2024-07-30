import {IResponse} from "../../index";
import {FlexBubble, FlexContainer, FlexMessage, FollowEvent} from "@line/bot-sdk";
import {ILineBotExternal} from "../../../../domain/interface/externals/lineBotExternal";
import {
  FlexMessageConverter,
  FlexMessageJSON
} from "../../../../infrastructure/external/line/messageBuilder/flexMessageBuilder";
import {ICalenderRepository} from "../../../../domain/interface/repositories/CalenderRepositoryInterface";
import {BubbleMessageBuilder} from "../../../../infrastructure/external/line/messageBuilder/bubbleMessageBuilder";

export class FollowUseCase {
  constructor(private lineBot: ILineBotExternal, private calenderRepository: ICalenderRepository) {
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
      const replyToken = event.replyToken; // イベントから返信トークンを取得
      const flexContainer = this.flexGreetMessage(); // 挨拶メッセージを生成
      const bubble = new BubbleMessageBuilder(flexContainer); // バブルメッセージを生成
      this.lineBot.replyMessage(replyToken, bubble); // メッセージを返信

      // ユーザー情報をカレンダーリポジトリに保存
      this.calenderRepository.putItem({user_id: event.source.userId, calenderId: ""});
    } catch(e) {
      // エラーログを出力し、エラーレスポンスを返す
      console.log(`[ ERROR ] Follow Event: ${e}`);
      return {data: "", status: 400, message: `[ ERROR ] Follow Event: ${e}`};
    }

    return {
      data: { msg: "挨拶メッセージの送信完了" }, // 成功メッセージを設定
      status: 200,
      message: "挨拶メッセージの送信完了"
    };
  }

  // 挨拶メッセージの内容を定義
  private flexGreetMessage(): FlexBubble
  {
    return {
      "type": "bubble",
      "hero": {
        "type": "image",
        "url": "https://ai-interview-calender-register.s3.ap-northeast-1.amazonaws.com/images/sumnail.jpg",
        "size": "full",
        "aspectRatio": "20:13",
        "aspectMode": "fit"
      },
      "body": {
        "type": "box",
        "layout": "vertical",
        "spacing": "md",
        "contents": [
          {
            "type": "text",
            "text": "簡単30秒でAI連携",
            "size": "xl",
            "weight": "bold"
          },
          {
            "type": "box",
            "layout": "vertical",
            "spacing": "sm",
            "contents": [
              {
                "type": "box",
                "layout": "baseline",
                "contents": [
                  {
                    "type": "icon",
                    "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
                  },
                  {
                    "type": "text",
                    "text": "BOTを追加",
                    "weight": "bold",
                    "margin": "sm",
                    "flex": 0
                  },
                  {
                    "type": "text",
                    "text": "15秒",
                    "size": "sm",
                    "align": "end",
                    "color": "#aaaaaa"
                  }
                ]
              },
              {
                "type": "box",
                "layout": "baseline",
                "contents": [
                  {
                    "type": "icon",
                    "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
                  },
                  {
                    "type": "text",
                    "text": "カレンダーIDを送信",
                    "weight": "bold",
                    "margin": "sm",
                    "flex": 0
                  },
                  {
                    "type": "text",
                    "text": "30秒",
                    "size": "sm",
                    "align": "end",
                    "color": "#aaaaaa"
                  }
                ]
              }
            ]
          },
          {
            "type": "text",
            "text": "Sauce, Onions, Pickles, Lettuce & Cheese",
            "wrap": true,
            "color": "#aaaaaa",
            "size": "xxs"
          }
        ]
      },
      "footer": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "button",
            "style": "primary",
            "color": "#8ECCB2",
            "margin": "xxl",
            "action": {
              "type": "uri",
              "label": "手順を確認",
              "uri": "https://qiita.com/dayjournal/items/c827a17917127bff3906"
            }
          }
        ]
      }
    };
  }

  // FollowUseCaseのインスタンスを作成する静的メソッド
  static builder(lineBot: ILineBotExternal, calenderRepository: ICalenderRepository): FollowUseCase {
    return new this(lineBot, calenderRepository);
  }
}
