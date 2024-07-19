export class Summary {
  constructor(private readonly summary: string) {
    // 空文字チェック
    if (summary.trim() === "") {
      throw new Error("概要は必須です");
    }

    // 最小文字数チェック
    const minimumLength = 5;
    if (summary.length < minimumLength) {
      throw new Error(`概要は${minimumLength}文字以上で入力してください`);
    }

    // 最大文字数チェック（オプション：必要に応じて追加）
    const maximumLength = 200; // 例として200文字を最大とする
    if (summary.length > maximumLength) {
      throw new Error(`概要は${maximumLength}文字以下で入力してください`);
    }

    this.summary = summary.trim(); // 前後の空白を削除して保存
  }

  public getValue(): string {
    return this.summary;
  }
}

