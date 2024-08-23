import { formatDateTime } from "@/lib/format";
import { EventType } from "@/types/event";
import { Zoomable } from "@likashefqet/react-native-image-zoom";
import { Image, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

type Props = {
  event: EventType;
};

const PaymentStatus = ({ event }: Props) => {
  const { deposit, price } = event;
  const pending = price - deposit;

  if (pending === 0) {
    return <Text className="text-green-500 text-xl">Pagado</Text>;
  }

  return <Text className="text-red-600 text-xl">Pendiente ${pending}</Text>;
};

export const EventDetail = ({ event }: Props) => {
  return (
    <View className="m-2">
      <Text className="text-white text-2xl font-bold mb-4">
        {event.fullName}
      </Text>
      <Text className="text-neutral-200 text-lg mb-4">
        {formatDateTime(event.date)}
      </Text>
      <Text className="text-white text-xl">Precio: ${event.price}</Text>
      <Text className="text-white text-xl">Abonado: ${event.deposit}</Text>
      <View className="flex-row mb-4">
        <Text className="text-white text-xl mr-2">Estado del pago:</Text>
        <PaymentStatus event={event} />
      </View>
      <Text className="text-white text-lg mb-4">{event.notes}</Text>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Zoomable
          minScale={0.5}
          maxScale={5}
          doubleTapScale={3}
          minPanPointers={1}
        >
          <Image
            source={{ uri: event.picture }}
            style={{ width: "100%", height: 500 }}
            resizeMode="cover"
          />
        </Zoomable>
      </GestureHandlerRootView>
    </View>
  );
};
