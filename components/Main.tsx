import { SectionList, Text } from "react-native";
import { getCalendarEvents } from "../lib/google/calendar";
import { AnimatedEventCard } from "./EventCard";
import { Screen } from "./Screen";
import { ExtendedUser, useSession } from "./SessionProvider";
import { formatDate } from "@/lib/format";
import { groupByDate } from "@/lib/utils/events";
import { useQuery } from "react-query";
import { LoadingIndicator } from "./LoadingIndicator";
import { NoEvents } from "./NoEvents";

const getGroupedEvents = (session: ExtendedUser) => {
  const today = new Date();
  const params = {
    calendarId: session.calendarId,
    accessToken: session.accessToken,
    since: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
  };

  const events = getCalendarEvents(params).then((events) => {
    const groupedEvents = groupByDate(events);
    return groupedEvents;
  });

  return events;
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

  if (isLoading) return <LoadingIndicator />;

  if (!events || events.length === 0) return <NoEvents />;

  return (
    <Screen>
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
    </Screen>
  );
}
