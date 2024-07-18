import {FlexMessageConverter, FlexMessageJSON} from "./messageBuilder/flexMessageBuilder";
import {ILineBotExternal, ILineConverter} from "../../../domain/interface/externals/line/lineBotExternal";
import {Client, FlexMessage, Message} from "@line/bot-sdk";
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