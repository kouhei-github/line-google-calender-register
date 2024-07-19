import { IGoogleCalenderExternal } from "../../../../domain/interface/externals/googleCalenderExternal";
import { IEnvSetUp } from "../../../../envs/config";
import { calendar_v3, google } from "googleapis";
import { JWT } from 'google-auth-library';
import {CalenderEntity} from "../../../../domain/models/calenderModel/calenderEntity";

export class GoogleCalenderExternal implements IGoogleCalenderExternal {
  private calendar: calendar_v3.Calendar;

  constructor(envLib: IEnvSetUp) {
    const jwtClient = new JWT({
      email: envLib.getGoogleClientEmail(),
      key: envLib.getGooglePrivateKey(),
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });
    this.calendar = google.calendar({ version: 'v3', auth: jwtClient });
  }

  public async createEventWithMeetLink(calenderId: string, calenderEntity: CalenderEntity): Promise<calendar_v3.Schema$Event> {
    try {
      const event: calendar_v3.Schema$Event = calenderEntity.googleCalenderFormat()

      const response = await this.calendar.events.insert({
        calendarId: calenderId,
        requestBody: event,
      });
      return response.data;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }

  static builder(envLib: IEnvSetUp): IGoogleCalenderExternal {
    return new this(envLib);
  }
}