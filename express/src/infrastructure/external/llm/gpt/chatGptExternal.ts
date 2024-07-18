import {Readable} from "node:stream";
import {ILlmExternal} from "../../../../domain/interface/externals/llmExternal";
import OpenAI from "openai";
import {IEnvSetUp} from "../../../../envs/config";

export class ChatGptExternal implements ILlmExternal {
  private openai: OpenAI;

  constructor(envLib: IEnvSetUp) {
    const config = {
      apiKey: envLib.getOpenAiApiToken(),
    };
    this.openai = new OpenAI(config);
  }



  static builder(envLib: IEnvSetUp): ILlmExternal
  {
    return new this(envLib)
  }
}