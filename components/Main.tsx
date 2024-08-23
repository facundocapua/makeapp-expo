import { ActivityIndicator, SectionList, Text } from "react-native";
import { getCalendarEvents } from "../lib/google/calendar";
import { AnimatedEventCard } from "./EventCard";
import { Screen } from "./Screen";
import { ExtendedUser, useSession } from "./SessionProvider";
import { formatDate } from "@/lib/format";
import { groupByDate } from "@/lib/utils/events";
import { useQuery } from "react-query";

const getGroupedEvents = (session: ExtendedUser) => {
  return getCalendarEvents({
    calendarId: session.calendarId,
    accessToken: session.accessToken,
  }).then((events) => {
    const groupedEvents = groupByDate(events);
    return groupedEvents;
  });
};

export function Main() {
  const { session } = useSession();

  const { isLoading, data: events } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      return getGroupedEvents(session!);
    },
    enabled: !!session,
  });

  if (!session) return null;

  return (
    <Screen>
      {isLoading || !events ? (
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
