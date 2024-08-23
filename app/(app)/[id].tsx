import { Stack } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Screen } from "../../components/Screen";
import { useEffect, useState } from "react";
import { getCalendarEvent } from "../../lib/google/calendar";
import { useSession } from "@/components/SessionProvider";
import { EventType } from "@/types/event";

export default function EventView() {
  const { id } = useLocalSearchParams();
  const [eventInfo, setEventInfo] = useState<EventType | null>(null);

  const { session } = useSession();

  useEffect(() => {
    if (id && session) {
      getCalendarEvent({
        calendarId: session.calendarId,
        eventId: id as string,
        accessToken: session.accessToken,
      }).then((event) => {
        setEventInfo(event);
      });
    }
  }, [id, session]);

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
        {eventInfo === null ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <View>
            <Text className="text-white text-2xl font-bold mb-8">
              {eventInfo.fullName}
            </Text>
          </View>
        )}
      </View>
    </Screen>
  );
}
