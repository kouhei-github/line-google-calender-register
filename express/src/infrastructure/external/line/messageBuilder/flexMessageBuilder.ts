import { FlexMessage } from '@line/bot-sdk';
import {ILineConverter} from "../../../../domain/interface/externals/lineBotExternal";

export interface FlexMessageJSON {
  type: 'bubble' | 'carousel';
  contents: any;
}

export class FlexMessageConverter implements ILineConverter{
  constructor(private json: FlexMessageJSON) {}
  public convert(): FlexMessage
  {
    // JSONの構造を検証
    this.validateJSON(this.json);

    // FlexMessageオブジェクトを作成
    return {
      type: 'flex',
      altText: 'This is a Flex Message',
      contents: this.json
    };
  }

  private validateJSON(json: FlexMessageJSON): void
  {
    if (json.type !== 'bubble' && json.type !== 'carousel') {
      throw new Error('Invalid Flex Message type. Must be either "bubble" or "carousel".');
    }

    if (json.type === 'carousel' && (!Array.isArray(json.contents) || json.contents.length === 0)) {
      throw new Error('Carousel must have an array of bubble contents.');
    }

    // 追加のバリデーションをここに実装できます
  }

  static builder(json: FlexMessageJSON): ILineConverter
  {
    return new this(json)
  }
}

// 使用例
// const converter = new FlexMessageConverter();
// const flexMessage = converter.convert(yourJSONObject);