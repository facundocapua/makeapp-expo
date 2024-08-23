import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SectionList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getCalendarEvents } from "../lib/google/calendar";
import { AnimatedEventCard } from "./EventCard";
import { Screen } from "./Screen";
import { useSession } from "./SessionProvider";
import {
  EventType,
  GroupedEventCollection,
  GroupedEventItemType,
} from "@/types/event";
import { formatDate } from "@/lib/format";

export const groupByDate = (events: EventType[]): GroupedEventItemType[] => {
  const groupedEvents = events.reduce(
    (current: GroupedEventCollection, item) => {
      const startDate = new Date(item.date);
      startDate.setHours(23, 59, 59);
      const dateIndex = `${startDate.getFullYear()}_${startDate.getMonth()}_${startDate.getDate()}`;
      current[dateIndex] ??= {
        title: startDate.toString(),
        data: [],
      };
      current[dateIndex].data.push(item);
      return current;
    },
    {},
  );
  const response = Object.values(groupedEvents);
  response.map((group) => {
    group.data.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });

    return group;
  });
  return response;
};

export function Main() {
  const [events, setEvents] = useState<GroupedEventItemType[]>([]);
  const { session } = useSession();

  useEffect(() => {
    if (!session) return;

    getCalendarEvents({
      calendarId: session.calendarId,
      accessToken: session.accessToken,
    }).then((events) => {
      const groupedEvents = groupByDate(events);
      setEvents(groupedEvents);
    });
  }, [session]);

  if (!session) return null;

  return (
    <Screen>
      {events.length === 0 ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : (
        <SectionList
          sections={events}
          keyExtractor={(item, index) => item.id + index}
          renderItem={({ item, index }) => (
            <AnimatedEventCard event={item} index={index} />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <Text className="text-xl font-bold text-gray-100">
              {formatDate(title)}
            </Text>
          )}
        />
      )}
    </Screen>
  );
}
