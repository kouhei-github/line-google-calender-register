import {calendar_v3} from "googleapis";

export  interface IGoogleCalenderExternal {
  createEventWithMeetLink(
    calendarId: string,
    summary: string,
    description: string,
    location: string,
    startDateTime: string,
    endDateTime: string,
    isOnlineMtg: boolean,
    timeZone: string,
  ): Promise<calendar_v3.Schema$Event>
}