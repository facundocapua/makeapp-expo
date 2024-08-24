import { EventType } from "@/types/event";
import { GoogleEventType } from "./types";
import { CALENDAR_DEFAULT_TIMEZONE, makeApiCall } from "./utils";

export type CalendarType = {
  id: string;
  summary: string;
  timeZone: string;
};

export const getCalendarByName = (
  name: string,
  accessToken: string,
): Promise<CalendarType> => {
  return makeApiCall({
    url: "/calendar/v3/users/me/calendarList",
    accessToken,
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      return res.items.find((item: CalendarType) => item.summary === name);
    });
};

export const createCalendar = (
  name: string,
  accessToken: string,
): Promise<CalendarType> => {
  return makeApiCall({
    url: "/calendar/v3/calendars",
    accessToken,
    method: "POST",
    data: {
      summary: name,
      timeZone: CALENDAR_DEFAULT_TIMEZONE,
    },
  }).then((res) => res.json());
};

type GetCalendarProps = {
  name: string;
  accessToken: string;
};

export const getCalendar = ({
  name,
  accessToken,
}: GetCalendarProps): Promise<CalendarType> => {
  return getCalendarByName(name, accessToken).then((calendar) => {
    if (!calendar) {
      return createCalendar(name, accessToken);
    }

    return calendar;
  });
};

export type GetCalendarEventsProps = {
  calendarId: string;
  accessToken: string;
  since?: Date;
  to?: Date;
};

export const getCalendarEvents = ({
  calendarId,
  accessToken,
  since,
  to,
}: GetCalendarEventsProps): Promise<EventType[]> => {
  const params: { [key: string]: string } = {
    orderBy: "startTime",
    singleEvents: "true",
  };

  if (since) {
    params.timeMin = since.toISOString();
  }

  if (to) {
    params.timeMax = to.toISOString();
  }

  return makeApiCall({
    url: `/calendar/v3/calendars/${calendarId}/events?${new URLSearchParams(params)}`,
    accessToken,
  })
    .then((res) => res.json())
    .then((res) => {
      return res.items.map((item: GoogleEventType): EventType => {
        const { id, description } = item;
        const data = JSON.parse(description);
        return {
          id,
          ...data,
        };
      });
    });
};

export type GetCalendarEventProps = {
  calendarId: string;
  eventId: EventType["id"];
  accessToken: string;
};

export const getCalendarEvent = ({
  calendarId,
  eventId,
  accessToken,
}: GetCalendarEventProps): Promise<EventType> => {
  return makeApiCall({
    url: `/calendar/v3/calendars/${calendarId}/events/${eventId}`,
    accessToken,
    method: "GET",
  })
    .then((res) => res.json())
    .then((res) => {
      const { id, description } = res;
      const data = JSON.parse(description);
      return {
        id,
        ...data,
      };
    });
};

export type CreateUpdateEventProps = {
  calendarId: string;
  event: any;
  accessToken: string;
};

export const createEvent = ({
  calendarId,
  event,
  accessToken,
}: CreateUpdateEventProps): Promise<GoogleEventType> => {
  return makeApiCall({
    url: `/calendar/v3/calendars/${calendarId}/events`,
    accessToken,
    method: "POST",
    data: event,
  })
    .then((res) => res.json())
    .then((res) => {
      console.log("Event created", res);
      return res;
    });
};
