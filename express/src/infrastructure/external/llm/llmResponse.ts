
interface ChatMessage {
  role: "assistant"
  content: string
}

export interface LlmResponse {
  model: string,
  choice: ChatMessage,
  usage?: {
    prompt_tokens: number,
    completion_tokens: number,
    total_tokens: number
  }
}