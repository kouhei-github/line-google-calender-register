import {ILlmExternal} from "../../../../domain/interface/externals/llmExternal";
import OpenAI from "openai";
import {IEnvSetUp} from "../../../../envs/config";
import {LlmResponse} from "../llmResponse";

export class ChatGptExternal implements ILlmExternal {
  private openai: OpenAI;
  private SYSTEM_PROMPT = `# 指示書
    メッセージより予定の詳細を抽出してください。
    ## フォーマットは下記Jsonで、お願いします。なければ空文字を入力してください
    summaryは誰と打ち合わせかわかるようにしてください。
    descriptionはなるべく生成してください
    
    ## アウトプットフォーマット
    {
      "summary": "",
      "description": "",
      "location": "",
      "startDateTime": "2024-07-20T10:00:00+09:00",
      "endDateTime": "2024-07-20T11:00:00+09:00",
    }
    `
  constructor(envLib: IEnvSetUp) {
    const config = {
      apiKey: envLib.getOpenAiApiToken(),
    };
    this.openai = new OpenAI(config);
  }

  public async prompt(text: string): Promise<LlmResponse>
  {
    const engine = await this.openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{role: 'system', content: `${this.SYSTEM_PROMPT}`},{ role: "user", content: text }],
    })

    const gptResponse = {
      model: engine.model,
      choice: {
        role: engine.choices[0].message.role,
        content: engine.choices[0].message.content ?? "",
      },
      usage: engine.usage
    }
    return gptResponse
  }

  public async audio(file: File): Promise<string>
  {
    const transcription = await this.openai.audio.transcriptions.create({
      file: file,
      model: "whisper-1"
    })
    return transcription.text
  }

  public async ocr(base64Image: string): Promise<LlmResponse>
  {
    const engine = await this.openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {role: 'system', content: `${this.SYSTEM_PROMPT}`},
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `${this.SYSTEM_PROMPT}`
            },
            {
              type: "image_url",
              image_url: {
                url: base64Image
              }
            }
          ]
        }
      ],
    })
    const gptResponse = {
      model: engine.model,
      choice: {
        role: engine.choices[0].message.role,
        content: engine.choices[0].message.content ?? "",
      },
      usage: engine.usage
    }
    return gptResponse
  }

  static builder(envLib: IEnvSetUp): ILlmExternal
  {
    return new this(envLib)
  }
}