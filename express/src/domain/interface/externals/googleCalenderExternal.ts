import {calendar_v3} from "googleapis";
import {CalenderEntity} from "../../models/calenderModel/calenderEntity";

export  interface IGoogleCalenderExternal {
  createEventWithMeetLink(calenderId: string, calenderEntity: CalenderEntity): Promise<calendar_v3.Schema$Event>
}