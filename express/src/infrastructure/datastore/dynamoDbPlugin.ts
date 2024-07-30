import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {DynamoDBDocumentClient} from "@aws-sdk/lib-dynamodb";
import {IEnvSetUp} from "../../envs/config";

export class DynamoDBConfig {
  private readonly client: DynamoDBDocumentClient;
  constructor(envLib: IEnvSetUp) {
    const client: DynamoDBClient = new DynamoDBClient({
      region: "ap-northeast-1",
      credentials: {
        accessKeyId: envLib.getAwsAccessKey(),
        secretAccessKey: envLib.getAwsAccessSecret(),
      }
    })
    this.client = DynamoDBDocumentClient.from(client)
  }

  public getClient(): DynamoDBDocumentClient
  {
    return this.client
  }
}
