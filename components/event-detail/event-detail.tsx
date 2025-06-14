import { formatDateTime, formatPrice } from "@/lib/format";
import { EventType } from "@/types/event";
import { Zoomable } from "@likashefqet/react-native-image-zoom";
import { Image, Text, View, Pressable } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaymentStatus } from "../payment-status";

import { CameraIcon, PhotoIcon, ShareIcon } from "@/components/Icons";
import { useSession } from "../SessionProvider";
import { createTakePhoto, createUploadImage, shareEvent } from "./actions";

type Props = {
  event: EventType;
  onChange: (event: EventType) => void;
};

export const EventDetail = ({ event, onChange }: Props) => {
  const { session } = useSession();

  const takePhoto = createTakePhoto(
    session?.accessToken ?? "",
    event,
    onChange,
  );
  const pickImage = createUploadImage(
    session?.accessToken ?? "",
    event,
    onChange,
  );

  const onShareEvent = async () => {
    shareEvent(event).catch((error) => {
      console.error("Error sharing event:", error);
      alert("Error al compartir la cita. Inténtalo de nuevo más tarde.");
    });
  };

  return (
    <View className="flex-1 flex-col h-full">
      <View className="flex-grow">
        <View className="m-2">
          <Text className="text-white text-2xl font-bold mb-4">
            {event.fullName}
          </Text>
          <Text className="text-neutral-200 text-lg mb-4">
            {formatDateTime(event.date)}
          </Text>
          <Text className="text-white text-xl">
            Precio: {formatPrice(event.price)}
          </Text>
          <Text className="text-white text-xl">
            Abonado: {formatPrice(event.deposit)}
          </Text>
          <View className="flex-row mb-4">
            <Text className="text-white text-xl mr-2">Estado del pago:</Text>
            <PaymentStatus event={event} />
          </View>
          <Text className="text-white text-lg mb-4">{event.notes}</Text>
        </View>
        {/* <Button title="Pick an image from camera roll" onPress={pickImage} /> */}
        {event.picture && (
          <GestureHandlerRootView style={{ flex: 1 }}>
            <Zoomable
              minScale={0.5}
              maxScale={5}
              doubleTapScale={3}
              maxPanPointers={1}
            >
              <Image
                source={{ uri: event.picture }}
                style={{ width: "100%", height: 500 }}
                resizeMode="cover"
              />
            </Zoomable>
          </GestureHandlerRootView>
        )}
      </View>
      <View className="pb-8 pt-4 flex-row w-full justify-evenly border-t border-white/50">
        <Pressable onPress={takePhoto}>
          <View className="flex-col items-center gap-2">
            <CameraIcon />
            <Text className="text-white text-xs">Tomar foto</Text>
          </View>
        </Pressable>
        <Pressable onPress={pickImage}>
          <View className="flex-col items-center gap-2">
            <PhotoIcon />
            <Text className="text-white text-xs">Subir foto</Text>
          </View>
        </Pressable>
        <Pressable onPress={onShareEvent}>
          <View className="flex-col items-center gap-2">
            <ShareIcon />
            <Text className="text-white text-xs">Compartir cita</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
};
