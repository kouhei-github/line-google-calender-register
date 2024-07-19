import {LlmResponse} from "../../../infrastructure/external/llm/llmResponse";

export interface ILlmExternal {
  prompt(text: string): Promise<LlmResponse>
}
