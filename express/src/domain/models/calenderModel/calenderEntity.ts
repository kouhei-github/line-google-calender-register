import { UserEntity } from "../userModel/userEntity";
import { Summary } from "./summary";
import { Description } from "./description";
import { Location } from "./location";
import { DateTimeEntity } from "./dateTimeEntity";
import {TimeZone} from "./timeZone";
import {calendar_v3} from "googleapis";

export class CalenderEntity {
  constructor(
    private summary: Summary,
    private description: Description,
    private location: Location,
    private timeZone: TimeZone,
    private dateTimeEntity: DateTimeEntity,
  ) {}

  // ゲッター
  public getDateTimeEntity(): DateTimeEntity {
    return this.dateTimeEntity;
  }

  public getSummary(): Summary {
    return this.summary;
  }

  public getDescription(): Description {
    return this.description;
  }

  public getLocation(): Location {
    return this.location;
  }

  public getTimeZone(): TimeZone
  {
    return this.timeZone;
  }

  // セッター
  public setDateTimeEntity(dateTimeEntity: DateTimeEntity): void {
    this.dateTimeEntity = dateTimeEntity;
  }

  public setSummary(summary: Summary): void {
    this.summary = summary;
  }

  public setDescription(description: Description): void {
    this.description = description;
  }

  public setLocation(location: Location): void {
    this.location = location;
  }

  // バリデーションメソッド
  public validateCurrentTime(): void {
    this.dateTimeEntity.validateCurrentTime();
  }

  public setTimeZone(timeZone: TimeZone): void
  {
    this.timeZone = timeZone;
  }

  // 日時の範囲を文字列で返すメソッド
  public getDateTimeRange(): string {
    return this.dateTimeEntity.getDateTimeRange();
  }

  public googleCalenderFormat(): calendar_v3.Schema$Event
  {
    return {
      summary: this.getSummary().getValue(),
      description: this.getDescription().getValue(),
      location: this.getLocation().getValue(),
      start: {
      dateTime: this.dateTimeEntity.getStart().getValue(),
        timeZone: this.getTimeZone().getValue(),
    },
      end: {
        dateTime: this.dateTimeEntity.getEnd().getValue(),
          timeZone: this.getTimeZone().getValue(),
      },
    }
  }


  // オプション: オブジェクトの文字列表現を返すメソッド
  public toString(): string {
    return `カレンダーの登録情報:
    日時: ${this.getDateTimeRange()}
    タイトル: ${this.summary.getValue()}
    会議詳細: ${this.description.getValue()}
    場所: ${this.location.getValue()}`;
  }
}