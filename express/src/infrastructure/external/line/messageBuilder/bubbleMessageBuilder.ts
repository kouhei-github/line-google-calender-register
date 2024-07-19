import {ILineConverter} from "../../../../domain/interface/externals/lineBotExternal";
import {FlexBubble, FlexMessage} from "@line/bot-sdk";
import {CalenderEntity} from "../../../../domain/models/calenderModel/calenderEntity";

export class BubbleMessageBuilder implements ILineConverter
{
  constructor(private bubbleMessage: FlexBubble) {
  }

  static GoogleRegisterUI(calenderUri: string, calenderEntity: CalenderEntity): FlexBubble
  {
    return {
      "type": "bubble",
      "header": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "text",
            "text": "カレンダーの登録情報:",
            "weight": "bold",
            "color": "#0f0f0f",
            "size": "sm",
            "margin": "sm"
          },
          {
            "type": "text",
            "text": calenderEntity.getSummary().getValue(),
            "weight": "bold",
            "size": "xl",
            "margin": "md",
            "wrap": true
          },
          {
            "type": "text",
            "text": calenderEntity.getDateTimeRange(),
            "size": "xs",
            "color": "#aaaaaa",
            "wrap": true
          }
        ]
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
                "text": calenderEntity.getDescription().getValue(),
                "size": "sm",
                "color": "#555555",
                "wrap": true
              },
              {
                "type": "text",
                "text": "※ Google MeetsでオンラインMTGが必要な場合は手動で登録してください",
                "size": "sm",
                "color": "#555555",
                "wrap": true,
                "margin": "md"
              },
              {
                "type": "separator",
                "margin": "xxl"
              }
            ]
          },
          {
            "type": "box",
            "layout": "vertical",
            "spacing": "sm",
            "contents": [
              {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": "場所",
                    "size": "md",
                    "color": "#555555"
                  },
                  {
                    "type": "text",
                    "text": calenderEntity.getLocation().getValue(),
                    "size": "md",
                    "color": "#111111",
                    "align": "start"
                  }
                ],
                "margin": "xl"
              },
              {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "size": "md",
                    "color": "#555555",
                    "text": "日時",
                    "flex": 0
                  },
                  {
                    "type": "text",
                    "size": "xs",
                    "color": "#111111",
                    "align": "start",
                    "text": calenderEntity.getDateTimeRange()
                  }
                ],
                "paddingTop": "12px"
              }
            ]
          }
        ]
      },
      "footer": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "button",
            "action": {
              "type": "uri",
              "label": "カレンダーを確認する",
              "uri": calenderUri
            },
            "style": "primary",
            "color": "#000000",
            "margin": "md"
          }
        ]
      },
      "styles": {
        "footer": {
          "separator": true
        }
      }
    }
  }


  public convert(): FlexMessage
  {
    return {
      type: 'flex',
      altText: 'This is a Flex Message',
      contents: this.bubbleMessage
    };
  }

  static builder(json: FlexBubble): ILineConverter
  {
    return new this(json)
  }
}