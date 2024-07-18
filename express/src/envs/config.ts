
export interface IEnvSetUp {
  setUp(): void
  getOpenAiApiToken(): string
  getLineChannelSecret(): string
  getLineAccessToken(): string
}

export class EnvSetUp implements IEnvSetUp
{
  private lineAccessToken: string
  private lineChannelSecret: string
  private openAiApiToken: string

  constructor()
  {
    this.lineAccessToken = process.env.LINE_ACCESS_TOKEN ?? ""
    this.lineChannelSecret = process.env.LINE_CHANNEL_SECRET ?? ""
    this.openAiApiToken = process.env.OPEN_AI_API_TOKEN ?? ""
  }

  public setUp(): void
  {
    if (this.lineAccessToken === "") {
      throw new Error("Line access token is required")
    }
    if (this.lineChannelSecret === "") {
      throw new Error("Line channel secret is required")
    }
    if (this.openAiApiToken === "") {
      throw new Error("OpenAi api token is required")
    }
  }

  public getLineAccessToken(): string
  {
    return this.lineAccessToken
  }

  public getLineChannelSecret(): string
  {
    return this.lineChannelSecret
  }

  public getOpenAiApiToken(): string
  {
    return this.openAiApiToken
  }

  static builder(): IEnvSetUp
  {
    return new this()
  }
}