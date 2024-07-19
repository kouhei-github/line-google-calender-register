import {ILineBotExternal, ILineConverter} from "../../../domain/interface/externals/lineBotExternal";
import { Client } from "@line/bot-sdk";
import {IEnvSetUp} from "../../../envs/config";
import {Readable} from "node:stream";

export class LineBotExternal implements ILineBotExternal {
  private bot: Client;

  constructor(envLib: IEnvSetUp) {
    const config = {
      channelAccessToken: envLib.getLineAccessToken(),
      channelSecret: envLib.getLineChannelSecret()
    };
    this.bot = new Client(config);
  }

  public pushMessage(lineUserId: string, converter: ILineConverter): void
  {
    const message = converter.convert()
    this.bot.pushMessage(lineUserId, message)
  }

  public replyMessage(replyToken: string, converter: ILineConverter): void
  {
    const message = converter.convert()
    this.bot.replyMessage(replyToken, message)
  }

  public async getAudioContent(messageId: string): Promise<File>
  {
    const stream = await this.bot.getMessageContent(messageId)
    // ストリームからバイナリーデータを取得
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    // すべてのチャンクを1つのBufferに結合
    const audioBuffer = Buffer.concat(chunks);
    // バッファーからFileオブジェクトを作成
    const file = new File([audioBuffer], 'audio.m4a', { type: 'audio/m4a' });
    return file
  }

  public async getImageContent(messageId: string)
  {
    const content = await this.bot.getMessageContent(messageId)
    const base64Image = await this.streamToBase64(content)
    return `data:image/jpeg;base64,${base64Image}`
  }

  private async streamToBase64(stream: Readable): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
      stream.on('error', (err) => reject(err));
      stream.on('end', () => {
        const result = Buffer.concat(chunks).toString('base64');
        resolve(result);
      });
    });
  }

  static builder(envLib: IEnvSetUp): ILineBotExternal
  {
    return new this(envLib)
  }
}