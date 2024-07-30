import {DynamoDB} from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  GetCommandInput, GetCommandOutput,
  PutCommand,
  PutCommandInput,
  PutCommandOutput
} from "@aws-sdk/lib-dynamodb";
import {DynamoDBConfig} from "../../dynamoDbPlugin";
import {
  ICalenderRepository
} from "../../../../domain/interface/repositories/CalenderRepositoryInterface";

export class CalenderRepository implements ICalenderRepository {
  TABLE_NAME = "ai-interview-calender-link"; // テーブル名を設定

  constructor(private client: DynamoDBDocumentClient) {}

  // アイテムをDynamoDBに追加するメソッド
  public async putItem(item: Record<string, any>): Promise<void> {
    const command: PutCommand = new PutCommand({
      TableName: this.TABLE_NAME,
      Item: item,
    } as PutCommandInput); // PutCommandを作成

    try {
      // コマンドを送信してアイテムを追加
      const response: PutCommandOutput = await this.client.send(command);
      console.log("Item added successfully:", response); // 成功メッセージを出力
    } catch (error) {
      console.error("Error adding item:", error); // エラーメッセージを出力
    }
  }

  // DynamoDBからアイテムを取得するメソッド
  public async getItem<T>(key: Record<string, any>): Promise<T> {
    const command: GetCommand = new GetCommand({
      TableName: this.TABLE_NAME,
      Key: key,
    } as GetCommandInput); // GetCommandを作成

    try {
      // コマンドを送信してアイテムを取得
      const response: GetCommandOutput = await this.client.send(command);
      return response.Item as T; // 取得したアイテムを返す
    } catch (error) {
      throw new Error(`Error getting item: ${error}`); // エラーメッセージを出力
    }
  }

  // CalenderRepositoryのインスタンスを作成する静的メソッド
  static builder(db: DynamoDBConfig): ICalenderRepository {
    return new this(db.getClient());
  }
}
