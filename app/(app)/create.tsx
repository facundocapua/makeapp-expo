import { CreateEventForm } from "@/components/events/create-event-form";
import { Screen } from "@/components/Screen";
import { useSession } from "@/components/SessionProvider";
import { createEvent } from "@/lib/google/calendar";
import { EventType } from "@/types/event";
import { Link, Stack } from "expo-router";
import { useState } from "react";
import { Pressable, Text } from "react-native";
import { useMutation, useQueryClient } from "react-query";

const isValid = (event: EventType) => {
  if (event.name === "") return false;
  if (event.price === "") return false;

  return true;
};

export default function CreateEvent() {
  const [canAdd, setCanAdd] = useState(false);
  const [event, setEvent] = useState<EventType>();
  const { session } = useSession();
  const queryClient = useQueryClient();

  const createEventMutation = useMutation({
    mutationFn: (event: EventType) => {
      return createEvent({
        calendarId: session!.calendarId,
        event,
        accessToken: session!.accessToken,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries("events");
    },
  });

  const handleChange = (data) => {
    setCanAdd(isValid(data));
    setEvent(data);
  };

  const saveEvent = () => {
    if (event && isValid(event)) {
      createEventMutation.mutate(event);
    }
  };

  return (
    <Screen>
      <Stack.Screen
        options={{
          //headerStyle: { backgroundColor: "#999" },
          headerTintColor: "#fff",
          headerLeft: () => {
            return (
              <Link href="/" asChild>
                <Pressable>
                  <Text className="text-red-600 font-bold">Cancelar</Text>
                </Pressable>
              </Link>
            );
          },
          headerTitle: "Nuevo Evento",
          headerRight: () => {
            return (
              <Pressable disabled={!canAdd} onPress={saveEvent}>
                <Text
                  className={`text-white font-bold ${!canAdd ? "opacity-40" : ""}`}
                >
                  Agregar
                </Text>
              </Pressable>
            );
          },
        }}
      />
      <CreateEventForm onChange={handleChange} />
    </Screen>
  );
}
