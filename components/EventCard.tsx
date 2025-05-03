import { Animated, Pressable, Text, View } from "react-native";
import { formatTime } from "../lib/format";
import { useEffect, useRef } from "react";
import { Link } from "expo-router";
import { EventType } from "@/types/event";
import { ClockIcon } from "./Icons";

const mapDurationToPadding = {
  30: "py-4",
  45: "py-6",
  60: "py-8",
  90: "py-12",
  120: "py-16",
};

type Props = {
  event: EventType;
};

export function EventCard({ event }: Props) {
  const { id, date, fullName, duration } = event;

  return (
    <Link href={`/${id}`} asChild>
      <Pressable className={`my-2 active:opacity-50`}>
        <View
          className={`flex-row gap-4 items-center bg-neutral-700 rounded-lg `}
        >
          <View
            className={`w-1/5 gap-1 flex-row items-center justify-center bg-neutral-600 rounded-l-lg h-full ${mapDurationToPadding[duration]}`}
          >
            <ClockIcon size={16} className="opacity-60" />
            <Text className="text-sm text-white text-center">
              {formatTime(date)}
            </Text>
          </View>
          <Text className="text-lg text-white">{fullName}</Text>
        </View>
      </Pressable>
    </Link>
  );
}

export function AnimatedEventCard({ event, index }: Props & { index: number }) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      delay: index * 100,
      useNativeDriver: true,
    }).start();
  }, [opacity, index]);

  return (
    <Animated.View style={{ opacity }}>
      <EventCard event={event} />
    </Animated.View>
  );
}
