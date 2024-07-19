export class Location {
  constructor(private readonly location: string) {
    // 空文字チェック
    if (location.trim() === "") {
      throw new Error("ロケーションは必須です");
    }

    this.location = location.trim(); // 前後の空白を削除して保存
  }

  public getValue(): string {
    return this.location;
  }
}