import { IGoogleCalenderExternal } from "../../../../domain/interface/externals/googleCalenderExternal";
import { IEnvSetUp } from "../../../../envs/config";
import { calendar_v3, google } from "googleapis";
import { JWT } from 'google-auth-library';

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

  public async createEventWithMeetLink(
    calendarId: string,
    summary: string,
    description: string,
    location: string,
    startDateTime: string,
    endDateTime: string,
    isOnlineMtg: boolean,
    timeZone: string,
  ): Promise<calendar_v3.Schema$Event> {
    try {
      const event: calendar_v3.Schema$Event = {
        summary: summary,
        description: description,
        location: location,
        start: {
          dateTime: startDateTime,
          timeZone: timeZone,
        },
        end: {
          dateTime: endDateTime,
          timeZone: timeZone,
        },
      };

      if (isOnlineMtg) {
        event.conferenceData = {
          createRequest: {
            requestId: `meet-${Date.now()}`,
            conferenceSolutionKey: {
              type: "hangoutsMeet"  // 'eventHangout' から 'hangoutsMeet' に変更
            },
          },
        };
      }

      const response = await this.calendar.events.insert({
        calendarId: calendarId,
        requestBody: event,
        conferenceDataVersion: isOnlineMtg ? 1 : 0,
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
