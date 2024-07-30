
export interface IEnvSetUp {
  setUp(): void
  getOpenAiApiToken(): string
  getLineChannelSecret(): string
  getLineAccessToken(): string
  getGoogleProjectId(): string
  getGooglePrivateKey(): string
  getGoogleClientEmail(): string
  getAwsAccessKey(): string
  getAwsAccessSecret(): string
  getEnv(): string
}

export class EnvSetUp implements IEnvSetUp
{
  private lineAccessToken: string
  private lineChannelSecret: string
  private openAiApiToken: string
  private googleClientEmail: string
  private googlePrivateKey: string
  private googleProjectId: string
  private awsAccessKey: string
  private awsAccessSecret: string
  private env: string

  constructor()
  {
    this.lineAccessToken   = process.env.LINE_ACCESS_TOKEN ?? ""
    this.lineChannelSecret = process.env.LINE_CHANNEL_SECRET ?? ""
    this.openAiApiToken    = process.env.OPEN_AI_API_TOKEN ?? ""
    this.googleClientEmail = process.env.GOOGLE_CLIENT_EMAIL ?? ""
    this.googlePrivateKey  = process.env.GOOGLE_PRIVATE_KEY ?? ""
    this.googleProjectId   = process.env.GOOGLE_PROJECT_ID ?? ""
    this.awsAccessKey      = process.env.AWS_ACCESS_KEY ?? ""
    this.awsAccessSecret   = process.env.AWS_ACCESS_SECRET ?? ""
    this.env               = process.env.ENV ?? ""
  }

  public setUp(): void
  {
    if (this.lineAccessToken === "") {
      throw new Error("line access token is required")
    }
    if (this.lineChannelSecret === "") {
      throw new Error("line channel secret is required")
    }
    if (this.openAiApiToken === "") {
      throw new Error("OpenAi api token is required")
    }
    if (this.googleClientEmail === "") {
      throw new Error("Google Client email is required")
    }
    if (this.googlePrivateKey === "") {
      throw new Error("Google Private key is required")
    }
    if (this.googleProjectId === "") {
      throw new Error("Google ProjectId is required")
    }
    if(this.env === "local"){
      if (this.awsAccessKey === ""){
        throw new Error("AWS_ACCESS_KEY is required")
      }
      if (this.awsAccessSecret === "") {
        throw new Error("AWS_ACCESS_SECRET is required")
      }
    }
  }

  public getGoogleClientEmail(): string
  {
    return this.googleClientEmail
  }

  public getGooglePrivateKey(): string
  {
    return this.googlePrivateKey.replace(/\\n/g, '\n')
  }

  public getGoogleProjectId(): string
  {
    return this.googleProjectId
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

  public getAwsAccessKey(): string
  {
    return this.awsAccessKey
  }

  public getAwsAccessSecret(): string
  {
    return this.awsAccessSecret
  }

  public getEnv(): string
  {
    return this.env
  }

  static builder(): IEnvSetUp
  {
    return new this()
  }
}