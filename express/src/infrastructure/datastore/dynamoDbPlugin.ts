import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {DynamoDBDocumentClient} from "@aws-sdk/lib-dynamodb";
import {IEnvSetUp} from "../../envs/config";

export class DynamoDBConfig {
  private readonly client: DynamoDBDocumentClient;

  constructor(envLib: IEnvSetUp) {
    // DynamoDBクライアントを作成し、リージョンと認証情報を設定
    const client: DynamoDBClient = new DynamoDBClient({
      region: "ap-northeast-1",
      credentials: {
        accessKeyId: envLib.getAwsAccessKey(), // 環境設定からAWSアクセスキーを取得
        secretAccessKey: envLib.getAwsAccessSecret(), // 環境設定からAWSシークレットアクセスキーを取得
      }
    });
    // DynamoDBDocumentClientを作成
    this.client = DynamoDBDocumentClient.from(client);
  }

  // DynamoDBDocumentClientのインスタンスを返すメソッド
  public getClient(): DynamoDBDocumentClient {
    return this.client;
  }
}
