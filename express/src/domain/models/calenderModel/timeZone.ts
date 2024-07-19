export class TimeZone
{
  private OUR_ALLOW_ZONE = ['Asia/Tokyo']
  private readonly timeZone: string;
  constructor(timeZone: string)
  {
    if (!this.OUR_ALLOW_ZONE.includes(timeZone)){
      throw new Error("無効なタイムゾーンです。Asia/Tokyoを選択してください");

    }
    this.timeZone = timeZone
  }

  public getValue(): string
  {
    return this.timeZone;
  }
}
