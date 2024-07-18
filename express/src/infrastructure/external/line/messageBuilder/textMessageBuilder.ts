import {ILineConverter} from "../../../../domain/interface/externals/line/lineBotExternal";
import {FlexMessageJSON} from "./flexMessageBuilder";
import {FlexMessage, TextMessage} from "@line/bot-sdk";

export class TextMessageBuilder implements ILineConverter {
  constructor(private text: string) {}

  public convert(): TextMessage
  {
    // FlexMessageオブジェクトを作成
    return {
      type: 'text',
      text: this.text
    };
  }


  static builder(text: string): ILineConverter
  {
    return new this(text)
  }
}