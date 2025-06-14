import { router, Stack } from "expo-router";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Screen } from "../../components/Screen";
import {
  deleteEvent,
  getCalendarEvent,
  updateEvent,
} from "../../lib/google/calendar";
import { useSession } from "@/components/SessionProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EventDetail } from "@/components/event-detail/event-detail";
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

      await queryClient.invalidateQueries({
        queryKey: [`event-${data.id}`],
      });
      queryClient.invalidateQueries({
        queryKey: ["events"],
      });
    },
  });

  const handleChange = (data: EventType) => {
    updateEventMutation.mutate(data);
  };

  const deleteEventMutation = useMutation({
    mutationFn: (eventId: string) => {
      return deleteEvent({
        calendarId: session!.calendarId,
        eventId,
        accessToken: session!.accessToken,
      });
    },
    onSuccess: async () => {
      Toast.show({
        type: "success", // or 'error' or 'delete'
        text1: "Cita eliminada",
        text2: "La cita ha sido eliminada exitosamente.",
      });

      queryClient.invalidateQueries({ queryKey: ["events"] });
      router.replace("/");
    },
  });

  const onDelete = () => {
    Alert.alert(
      "Eliminar cita",
      "¿Estás seguro de que quieres eliminar esta cita?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => deleteEventMutation.mutate(id as string),
        },
      ],
    );
  };

  return (
    <Screen>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: "#999" },
          headerTintColor: "#fff",
          headerLeft: undefined,
          headerTitle: eventInfo ? eventInfo.fullName : "Cargando...",
          headerRight: () => {
            return (
              <Pressable onPress={onDelete}>
                <Text className="text-red-700 font text-base">Eliminar</Text>
              </Pressable>
            );
          },
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
