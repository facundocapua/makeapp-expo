import { Animated, Pressable, Text, View } from "react-native";
import { formatTime } from "../lib/format";
import { useEffect, useRef } from "react";
import { Link } from "expo-router";
import { styled } from "nativewind";
import { EventType } from "@/types/event";

const StyledPressable = styled(Pressable);

type Props = {
  event: EventType;
};

export function EventCard({ event }: Props) {
  return (
    <Link href={`/${event.id}`} asChild>
      <StyledPressable className="bg-neutral-700 my-2 rounded-lg  active:opacity-50">
        <View className="flex-row items-center py-4">
          <Text className="text-sm text-white w-1/5 text-center">
            {formatTime(event.date)}
          </Text>
          <Text className="text-lg text-white">{event.fullName}</Text>
        </View>
      </StyledPressable>
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
