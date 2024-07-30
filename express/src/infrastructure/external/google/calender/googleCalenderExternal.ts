import { IGoogleCalenderExternal } from "../../../../domain/interface/externals/googleCalenderExternal";
import { IEnvSetUp } from "../../../../envs/config";
import { calendar_v3, google } from "googleapis";
import { JWT } from 'google-auth-library';
import { CalenderEntity } from "../../../../domain/models/calenderModel/calenderEntity";

export class GoogleCalenderExternal implements IGoogleCalenderExternal {
  private calendar: calendar_v3.Calendar;

  constructor(envLib: IEnvSetUp) {
    // GoogleサービスアカウントのJWTクライアントを作成
    const jwtClient = new JWT({
      email: envLib.getGoogleClientEmail(), // 環境設定からGoogleクライアントのメールアドレスを取得
      key: envLib.getGooglePrivateKey(), // 環境設定からGoogleプライベートキーを取得
      scopes: ['https://www.googleapis.com/auth/calendar'], // カレンダーAPIのスコープを指定
    });
    // GoogleカレンダーAPIのクライアントを作成
    this.calendar = google.calendar({ version: 'v3', auth: jwtClient });
  }

  // Googleカレンダーにイベントを作成し、Meetリンクを生成するメソッド
  public async createEventWithMeetLink(calenderId: string, calenderEntity: CalenderEntity): Promise<calendar_v3.Schema$Event> {
    try {
      // カレンダーエンティティをGoogleカレンダーAPI用の形式に変換
      const event: calendar_v3.Schema$Event = calenderEntity.googleCalenderFormat();

      // イベントをGoogleカレンダーに挿入
      const response = await this.calendar.events.insert({
        calendarId: calenderId,
        requestBody: event,
      });
      return response.data; // 作成されたイベントデータを返す
    } catch (error) {
      console.error('Error creating event:', error); // エラーメッセージを出力
      throw error; // エラーを再スロー
    }
  }

  // GoogleCalenderExternalのインスタンスを作成する静的メソッド
  static builder(envLib: IEnvSetUp): IGoogleCalenderExternal {
    return new this(envLib);
  }
}
