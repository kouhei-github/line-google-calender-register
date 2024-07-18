import {IResponse} from "../../index";
import { FollowEvent } from "@line/bot-sdk";
import {ILineBotExternal} from "../../../../domain/interface/externals/line/lineBotExternal";
import {
  FlexMessageConverter,
  FlexMessageJSON
} from "../../../../infrastructure/external/line/messageBuilder/flexMessageBuilder";

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
      const flexMessage: FlexMessageJSON = {
        "type": "carousel",
        "contents": [
          {
            "type": "bubble",
            "hero": {
              "type": "image",
              "url": "https://vitalify.jp/common/img/top_visual/top_service.png",
              "aspectMode": "fit",
              "size": "3xl"
            },
            "body": {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": "自然言語で予定を登録",
                      "size": "xxs",
                      "color": "#ffffff"
                    },
                    {
                      "type": "text",
                      "text": "会話口調で予定を登録",
                      "size": "xxs",
                      "color": "#ffffff"
                    },
                    {
                      "type": "text",
                      "text": "Service",
                      "color": "#ffffff",
                      "size": "lg",
                      "contents": [],
                      "margin": "sm"
                    },
                    {
                      "type": "text",
                      "text": "明日の15時から2時間、会議室Aでプロジェクトミーティング」のように自然な文章で入力するだけで、Googleカレンダーに予定を登録できます。",
                      "color": "#ffffff",
                      "wrap": true,
                      "margin": "lg",
                      "size": "sm"
                    }
                  ]
                },
                {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": "カレンダーの初期設定",
                          "action": {
                            "type": "uri",
                            "label": "カレンダーの初期設定",
                            "uri": "https://vitalify.jp/service/"
                          },
                          "color": "#ffffff",
                          "size": "xs"
                        }
                      ],
                      "borderColor": "#ffffff",
                      "borderWidth": "normal",
                      "width": "65%",
                      "justifyContent": "center",
                      "height": "40px",
                      "alignItems": "center"
                    }
                  ],
                  "margin": "md",
                  "justifyContent": "center",
                  "alignItems": "center",
                  "height": "40px"
                },
                {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": "どのようにしてアプリを使うか、動画で確認しましょう！！",
                      "wrap": true,
                      "color": "#ffffff",
                      "size": "sm"
                    }
                  ],
                  "paddingTop": "20px"
                },
                {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": "使い方の動画を確認",
                          "action": {
                            "type": "uri",
                            "label": "使い方の動画を確認",
                            "uri": "https://vitalify.jp/app-lab/"
                          },
                          "color": "#ffffff",
                          "size": "xs"
                        }
                      ],
                      "borderColor": "#ffffff",
                      "borderWidth": "normal",
                      "width": "65%",
                      "justifyContent": "center",
                      "height": "40px",
                      "alignItems": "center"
                    }
                  ],
                  "margin": "md",
                  "justifyContent": "center",
                  "alignItems": "center",
                  "height": "40px"
                }
              ],
              "backgroundColor": "#F08300"
            },
            "styles": {
              "hero": {
                "backgroundColor": "#F08300"
              }
            }
          },
          {
            "type": "bubble",
            "hero": {
              "type": "image",
              "url": "https://vitalify.jp/common/img/top_visual/top_about.png",
              "aspectMode": "fit",
              "size": "3xl"
            },
            "body": {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": "人工知能を使用して言語から必要な情報を解析",
                      "size": "xxs",
                      "color": "#ffffff"
                    },
                    {
                      "type": "text",
                      "text": "About",
                      "color": "#ffffff",
                      "size": "lg",
                      "contents": [],
                      "margin": "sm"
                    },
                    {
                      "type": "text",
                      "text": "ChatGPTが自然言語を解析し、日時、場所、タイトルなどを正確に抽出。入力の手間を大幅に削減します。",
                      "color": "#ffffff",
                      "wrap": true,
                      "margin": "lg",
                      "size": "sm"
                    },
                    {
                      "type": "text",
                      "text": "文字の意味合いを人工知能が解析して、日時、内容、人の名前を登録",
                      "color": "#ffffff",
                      "wrap": true,
                      "size": "sm",
                      "margin": "xs"
                    },
                    {
                      "type": "text",
                      "text": "使い方の確認はこちらの動画から。",
                      "color": "#ffffff",
                      "wrap": true,
                      "margin": "xs",
                      "size": "sm"
                    }
                  ],
                  "paddingBottom": "23px"
                },
                {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": "使い方の動画を確認",
                          "action": {
                            "type": "uri",
                            "label": "使い方の動画を確認",
                            "uri": "https://vitalify.jp/about/"
                          },
                          "color": "#ffffff",
                          "size": "xs"
                        }
                      ],
                      "borderColor": "#ffffff",
                      "borderWidth": "normal",
                      "width": "65%",
                      "justifyContent": "center",
                      "height": "40px",
                      "alignItems": "center"
                    }
                  ],
                  "margin": "md",
                  "justifyContent": "center",
                  "alignItems": "center",
                  "height": "40px"
                }
              ],
              "backgroundColor": "#FFBA01"
            },
            "styles": {
              "hero": {
                "backgroundColor": "#FFBA01"
              }
            }
          },
          {
            "type": "bubble",
            "hero": {
              "type": "image",
              "url": "https://vitalify.jp/common/img/top_visual/top_works.png",
              "aspectMode": "fit",
              "size": "3xl"
            },
            "body": {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": "Google Meets URLの自動生成",
                      "size": "xxs",
                      "color": "#ffffff"
                    },
                    {
                      "type": "text",
                      "text": "Works",
                      "color": "#ffffff",
                      "size": "lg",
                      "contents": [],
                      "margin": "sm"
                    },
                    {
                      "type": "text",
                      "text": "オンラインミーティングが必要な場合、自動でGoogle Meets URLを生成し、予定に追加します。",
                      "color": "#ffffff",
                      "wrap": true,
                      "margin": "lg",
                      "size": "sm"
                    },
                    {
                      "type": "text",
                      "text": "人工知能の解析によって自然言語の中からオンラインミーティングの可能性があれば、Google Meetsの発行",
                      "color": "#ffffff",
                      "wrap": true,
                      "size": "sm",
                      "margin": "xs"
                    },
                    {
                      "type": "text",
                      "text": "使い方の確認はこちらの動画から。",
                      "color": "#ffffff",
                      "wrap": true,
                      "margin": "xs",
                      "size": "sm"
                    }
                  ],
                  "paddingBottom": "2px"
                },
                {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": "使い方の動画を確認",
                          "action": {
                            "type": "uri",
                            "label": "使い方の動画を確認",
                            "uri": "https://vitalify.jp/works/"
                          },
                          "color": "#ffffff",
                          "size": "xs"
                        }
                      ],
                      "borderColor": "#ffffff",
                      "borderWidth": "normal",
                      "width": "65%",
                      "justifyContent": "center",
                      "height": "40px",
                      "alignItems": "center"
                    }
                  ],
                  "margin": "md",
                  "justifyContent": "center",
                  "alignItems": "center",
                  "height": "40px"
                }
              ],
              "backgroundColor": "#96BC12"
            },
            "styles": {
              "hero": {
                "backgroundColor": "#96BC12"
              }
            }
          },
          {
            "type": "bubble",
            "hero": {
              "type": "image",
              "url": "https://vitalify.jp/common/img/top_visual/top_recruit.png",
              "aspectMode": "fit",
              "size": "3xl"
            },
            "body": {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": "画像からの予定登録",
                      "size": "xxs",
                      "color": "#ffffff"
                    },
                    {
                      "type": "text",
                      "text": "Staff",
                      "color": "#ffffff",
                      "size": "lg",
                      "contents": [],
                      "margin": "sm"
                    },
                    {
                      "type": "text",
                      "text": "スクリーショットなど写真をアップロードするだけで、AIが画像内の文字を読み取り、自動で予定を登録します。",
                      "color": "#ffffff",
                      "wrap": true,
                      "margin": "lg",
                      "size": "sm"
                    },
                    {
                      "type": "text",
                      "text": "手入力の手間を省き、正確な情報をカレンダーに反映できます。",
                      "color": "#ffffff",
                      "wrap": true,
                      "size": "sm",
                      "margin": "xs"
                    }
                  ],
                  "paddingBottom": "42px"
                },
                {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": "使い方の動画を確認",
                          "action": {
                            "type": "uri",
                            "label": "使い方の動画を確認",
                            "uri": "https://vitalify.jp/staff/"
                          },
                          "color": "#ffffff",
                          "size": "xs"
                        }
                      ],
                      "borderColor": "#ffffff",
                      "borderWidth": "normal",
                      "width": "65%",
                      "justifyContent": "center",
                      "height": "40px",
                      "alignItems": "center"
                    }
                  ],
                  "margin": "md",
                  "justifyContent": "center",
                  "alignItems": "center",
                  "height": "40px"
                }
              ],
              "backgroundColor": "#FF3C2F"
            },
            "styles": {
              "hero": {
                "backgroundColor": "#FF3C2F"
              }
            }
          }
        ]
      }

      const flexMessageConv = FlexMessageConverter.builder(flexMessage)

      this.lineBot.replyMessage(replyToken, flexMessageConv)
    } catch(e) {
      console.log(`[ ERROR ] Follow Event: ${e}`)
      return {data: "", status: 400, message: `[ ERROR ] Follow Event: ${e}`}
    }

    return {
      data: { msg: "挨拶メッセージの送信完了" },
      status: 200,
      message: "挨拶メッセージの送信完了"
    }
  }

  static builder(lineBot: ILineBotExternal): FollowUseCase
  {
    return new this(lineBot)
  }
}
