import { Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Screen } from "../../components/Screen";
import { getCalendarEvent } from "../../lib/google/calendar";
import { useSession } from "@/components/SessionProvider";
import { useQuery } from "react-query";
import { EventDetail } from "@/components/EventDetail";

export default function EventView() {
  const { id } = useLocalSearchParams();

  const { session } = useSession();

  const { data: eventInfo } = useQuery({
    queryKey: [`event-${id}`],
    queryFn: async () => {
      return getCalendarEvent({
        calendarId: session!.calendarId,
        eventId: id as string,
        accessToken: session!.accessToken,
      }).then((event) => {
        return event;
      });
    },
    enabled: !!session && !!id,
  });

  return (
    <Screen>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: "#999" },
          headerTintColor: "#fff",
          headerLeft: () => {},
          headerTitle: eventInfo ? eventInfo.fullName : "Cargando...",
          headerRight: () => {},
        }}
      />
      <View>
        {!eventInfo ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <EventDetail event={eventInfo} />
        )}
      </View>
    </Screen>
  );
}
