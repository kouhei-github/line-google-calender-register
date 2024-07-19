export class EndDateTime {
  private readonly dateTime: Date;

  constructor(dateTimeString: string) {
    // ISO 8601形式（タイムゾーン付き）のバリデーション
    const isoFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/;
    if (!isoFormat.test(dateTimeString)) {
      throw new Error("無効な日時フォーマットです。'YYYY-MM-DDTHH:mm:ss+HH:mm'の形式で入力してください。");
    }

    // 日付の有効性チェック
    const date = new Date(dateTimeString);
    if (isNaN(date.getTime())) {
      throw new Error("無効な日付です。");
    }

    // 現在時刻より前の日時はエラー
    const now = new Date();
    if (date < now) {
      throw new Error("終了日時は現在時刻より後に設定してください。");
    }

    this.dateTime = date;
  }

  public getValue(): string {
    return this.dateTime.toISOString();
  }

  public getDate(): Date {
    return new Date(this.dateTime);
  }
}