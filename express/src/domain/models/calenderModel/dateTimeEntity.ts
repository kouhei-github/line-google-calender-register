import {StartDateTime} from "./startDateTime";
import {EndDateTime} from "./endDateTime";

export class DateTimeEntity
{
  constructor( private start: StartDateTime,  private end: EndDateTime) {
  }

  public validateCurrentTime(): void {
    const now = new Date();
    const startDate = this.start.getDate();
    const endDate = this.end.getDate();

    if (now > endDate) {
      throw new Error("現在時刻が終了日時より後です。イベントは既に終了しています。");
    }
  }

  public getStart(): StartDateTime {
    return this.start;
  }

  public getEnd(): EndDateTime {
    return this.end;
  }

  public setStart(start: StartDateTime): void
  {
    this.start = start;
  }

  public setEnd(end: EndDateTime): void
  {
    this.end = end;
  }

  // 日時の範囲を文字列で返すメソッド（オプション）
  public getDateTimeRange(): string {
    const startFormatted = this.formatDate(this.start.getDate());
    const endFormatted = this.formatDate(this.end.getDate());
    return `${startFormatted} から ${endFormatted}`;
  }

  private formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Tokyo'
    };
    return new Intl.DateTimeFormat('ja-JP', options).format(date);
  }
}