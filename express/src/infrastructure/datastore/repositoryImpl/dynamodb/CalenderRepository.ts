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

export class CalenderRepository implements ICalenderRepository
{
  TABLE_NAME = "ai-interview-calender-link"
  constructor(private client: DynamoDBDocumentClient) {
  }

  public async putItem(item: Record<string, any>): Promise<void>
  {
    const command: PutCommand = new PutCommand({
      TableName: this.TABLE_NAME,
      Item: item,
    } as PutCommandInput);

    try {
      const response: PutCommandOutput = await this.client.send(command);
      console.log("Item added successfully:", response);
    } catch (error) {
      console.error("Error adding item:", error);
    }
  }

  public async getItem<T>(key: Record<string, any>): Promise<T>
  {
    const command: GetCommand = new GetCommand({
      TableName: this.TABLE_NAME,
      Key: key,
    } as GetCommandInput);

    try {
      const response: GetCommandOutput = await this.client.send(command);
      return response.Item as T;
    } catch (error) {
      throw new Error(`Error getting item: ${error}`)
    }
  }

  static builder(db: DynamoDBConfig): ICalenderRepository
  {
    return new this(db.getClient())
  }
}