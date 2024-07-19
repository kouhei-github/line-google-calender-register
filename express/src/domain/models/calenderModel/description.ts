export class Description {
  constructor(private readonly description: string) {
    // 空文字チェック
    if (description.trim() === "") {
      throw new Error("説明は必須です");
    }

    // 最小文字数チェック
    const minimumLength = 15;
    if (description.length < minimumLength) {
      throw new Error(`説明は${minimumLength}文字以上で入力してください`);
    }

    // 最大文字数チェック（オプション：必要に応じて追加）
    const maximumLength = 1000; // 例として1000文字を最大とする
    if (description.length > maximumLength) {
      throw new Error(`説明は${maximumLength}文字以下で入力してください`);
    }

    this.description = description.trim(); // 前後の空白を削除して保存
  }

  public getValue(): string {
    return this.description;
  }
}