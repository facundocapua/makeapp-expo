import { Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Screen } from "../../components/Screen";
import { getCalendarEvent, updateEvent } from "../../lib/google/calendar";
import { useSession } from "@/components/SessionProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EventDetail } from "@/components/EventDetail";
import Toast from "react-native-toast-message";
import { EventType } from "@/types/event";

export default function EventView() {
  const { id } = useLocalSearchParams();

  const { session } = useSession();
  const queryClient = useQueryClient();

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

  const updateEventMutation = useMutation({
    mutationFn: (event: EventType) => {
      return updateEvent({
        calendarId: session!.calendarId,
        eventId: event.id as string,
        event,
        accessToken: session!.accessToken,
      });
    },
    onSuccess: async (data) => {
      Toast.show({
        type: "success", // or 'error' or 'delete'
        text1: "Cita actualizada",
        text2: "La cita ha sido actualizada exitosamente.",
      });

      await queryClient.invalidateQueries({ queryKey: [`event-${data.id}`] });
    },
  });

  const handleChange = (data: EventType) => {
    updateEventMutation.mutate(data);
  };

  return (
    <Screen>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: "#999" },
          headerTintColor: "#fff",
          headerLeft: undefined,
          headerTitle: eventInfo ? eventInfo.fullName : "Cargando...",
          headerRight: undefined,
        }}
      />

      <View className="h-full">
        {!eventInfo ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <EventDetail event={eventInfo} onChange={handleChange} />
        )}
      </View>
    </Screen>
  );
}
