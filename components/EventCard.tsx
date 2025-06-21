import { Animated, Pressable, Text, View } from "react-native";
import { formatTime, formatPrice } from "../lib/format";
import { useEffect, useRef } from "react";
import { Link } from "expo-router";
import { EventType } from "@/types/event";
import {
  ClockIcon,
  MoneyIcon,
  CheckCircleIcon,
  WarningIcon,
  PlayCircleIcon,
} from "./Icons";

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
  const { id, date, fullName, duration, price, deposit } = event;

  // Calcular estado de pago
  const depositAmount = Number(deposit ?? 0);
  const totalAmount = Number(price ?? 0);
  const pending = totalAmount - depositAmount;

  // Verificar si el evento está en curso
  const isEventInProgress = () => {
    const now = new Date();
    const eventDate = new Date(date);
    const eventEndTime = new Date(eventDate.getTime() + duration * 60000); // duration en minutos

    return now >= eventDate && now <= eventEndTime;
  };

  const inProgress = isEventInProgress();

  // Determinar estado y colores
  const getPaymentStatus = () => {
    if (totalAmount === 0) {
      return {
        status: "no-price",
        color: "bg-gray-500",
        textColor: "text-gray-300",
        icon: null,
      };
    }
    if (pending === 0) {
      return {
        status: "paid",
        color: "bg-green-500",
        textColor: "text-green-300",
        icon: <CheckCircleIcon size={16} color="#10b981" />,
      };
    }
    if (depositAmount === 0) {
      return {
        status: "unpaid",
        color: "bg-red-500",
        textColor: "text-red-300",
        icon: <WarningIcon size={16} color="#ef4444" />,
      };
    }
    return {
      status: "partial",
      color: "bg-yellow-500",
      textColor: "text-yellow-300",
      icon: <MoneyIcon size={16} color="#f59e0b" />,
    };
  };

  const paymentStatus = getPaymentStatus();

  return (
    <Link href={`/${id}`} asChild>
      <Pressable className="my-2 active:opacity-50">
        <View
          className={`flex-row rounded-lg overflow-hidden ${
            inProgress
              ? "bg-blue-600/30 border-2 border-blue-400"
              : "bg-neutral-700"
          }`}
        >
          {/* Sección de tiempo */}
          <View
            className={`w-1/5 gap-1 flex-row items-center justify-center ${
              inProgress ? "bg-blue-500" : "bg-neutral-600"
            } ${mapDurationToPadding[duration]}`}
          >
            <ClockIcon size={16} className="opacity-60" />
            <Text className="text-sm text-white text-center">
              {formatTime(date)}
            </Text>
          </View>

          {/* Contenido principal */}
          <View className="flex-1 p-4 justify-center">
            <View className="flex-row items-center gap-2 mb-1">
              <Text className="text-lg text-white font-medium">{fullName}</Text>
              {inProgress && (
                <View className="flex-row items-center gap-1 bg-blue-500/20 px-2 py-1 rounded-full">
                  <PlayCircleIcon size={14} color="#3b82f6" />
                  <Text className="text-xs text-blue-400 font-medium">
                    EN CURSO
                  </Text>
                </View>
              )}
            </View>

            {/* Estado de pago */}
            <View className="flex-row items-center gap-2">
              {paymentStatus.icon}
              {totalAmount > 0 ? (
                <View className="flex-row items-center gap-1">
                  {paymentStatus.status === "paid" && (
                    <Text className={`text-sm ${paymentStatus.textColor}`}>
                      Pagado • {formatPrice(totalAmount)}
                    </Text>
                  )}
                  {paymentStatus.status === "unpaid" && (
                    <Text className={`text-sm ${paymentStatus.textColor}`}>
                      Pendiente • {formatPrice(totalAmount)}
                    </Text>
                  )}
                  {paymentStatus.status === "partial" && (
                    <Text className={`text-sm ${paymentStatus.textColor}`}>
                      Resta • {formatPrice(pending)}
                    </Text>
                  )}
                </View>
              ) : (
                <Text className={`text-sm ${paymentStatus.textColor}`}>
                  Sin precio asignado
                </Text>
              )}
            </View>
          </View>

          {/* Indicador de estado visual */}
          <View
            className={`w-1 ${
              inProgress ? "bg-blue-400" : paymentStatus.color
            }`}
          />
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
