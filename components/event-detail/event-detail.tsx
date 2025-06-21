import { formatDateTime, formatPrice } from "@/lib/format";
import { EventType } from "@/types/event";
import { Zoomable } from "@likashefqet/react-native-image-zoom";
import {
  Image,
  Text,
  View,
  Pressable,
  Modal,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaymentStatus } from "../payment-status";
import { useState } from "react";

import {
  CameraIcon,
  MoneyIcon,
  PhotoIcon,
  ShareIcon,
  FileTextIcon,
} from "@/components/Icons";
import { useSession } from "../SessionProvider";
import { createTakePhoto, createUploadImage, shareEvent } from "./actions";
import { EditableValue } from "./editable-value";
import { EditableDate } from "./editable-date";
import { EditableNotes } from "./editable-notes";

type Props = {
  event: EventType;
  onChange: (event: EventType) => void;
};

export const EventDetail = ({ event, onChange }: Props) => {
  const { session } = useSession();
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isModalImageLoading, setIsModalImageLoading] = useState(false);
  const screenDimensions = Dimensions.get("window");

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

  const updateValue = (field: string, value: string | number | Date) => {
    const updatedEvent = { ...event, [field]: value };
    onChange(updatedEvent);
  };

  return (
    <>
      <View className="h-full flex flex-col gap-2">
        <View className="m-2 flex flex-col gap-y-6 flex-grow">
          <Text className="text-white text-2xl font-bold">
            {event.fullName}
          </Text>
          <EditableDate
            value={event.date}
            format={formatDateTime}
            label="Fecha y hora"
            onChange={(value) => updateValue("date", value)}
          />
          <EditableValue
            value={event.price}
            format={formatPrice}
            icon={<MoneyIcon />}
            label="Precio"
            onChange={(value) => updateValue("price", value)}
          />
          <EditableValue
            value={event.deposit}
            format={formatPrice}
            icon={<MoneyIcon />}
            label="Abonado"
            onChange={(value) => updateValue("deposit", value)}
          />
          <PaymentStatus event={event} />
          <EditableNotes
            value={event.notes}
            icon={<FileTextIcon />}
            label="Notas"
            placeholder="Agregar notas sobre la cita..."
            onChange={(value) => updateValue("notes", value)}
          />
        </View>

        {/* Image Section */}
        <View className="h-[300px] w-full relative">
          {event.picture ? (
            <TouchableOpacity
              onPress={() => setIsImageModalVisible(true)}
              activeOpacity={0.8}
              className="w-full h-full"
            >
              {isImageLoading && (
                <View className="absolute inset-0 bg-black/30 flex items-center justify-center z-[1]">
                  <ActivityIndicator size="large" color="#fff" />
                </View>
              )}
              <Image
                source={{ uri: event.picture }}
                className="rounded-lg w-full h-full"
                resizeMode="cover"
                onLoadStart={() => setIsImageLoading(true)}
                onLoadEnd={() => setIsImageLoading(false)}
                onError={() => setIsImageLoading(false)}
              />
            </TouchableOpacity>
          ) : (
            <View className="w-full h-full bg-white/10 justify-center items-center rounded-lg border-2 border-white/30 border-dashed">
              <PhotoIcon />
              <Text className="text-white/70 mt-3 text-base text-center">
                No hay imagen cargada
              </Text>
              <Text className="text-white/50 mt-1 text-sm text-center">
                Toca "Tomar foto" o "Subir foto" para agregar una imagen
              </Text>
            </View>
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

      {/* Image Modal */}
      <Modal
        visible={isImageModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsImageModalVisible(false)}
      >
        <View className="flex-1 bg-black/90 justify-center items-center">
          <TouchableOpacity
            className="absolute top-12 right-5 z-[1] p-2"
            onPress={() => setIsImageModalVisible(false)}
          >
            <Text className="text-white text-lg font-bold">✕</Text>
          </TouchableOpacity>

          {event.picture && (
            <GestureHandlerRootView
              style={{
                width: screenDimensions.width,
                height: screenDimensions.height,
              }}
            >
              {isModalImageLoading && (
                <View className="absolute inset-0 bg-black/50 justify-center items-center z-[2]">
                  <ActivityIndicator size="large" color="#fff" />
                  <Text className="text-white mt-2 text-base">
                    Cargando imagen...
                  </Text>
                </View>
              )}
              <Zoomable
                minScale={0.5}
                maxScale={5}
                doubleTapScale={3}
                maxPanPointers={1}
                isPanEnabled={true}
                isPinchEnabled={true}
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={{ uri: event.picture }}
                  style={{
                    width: screenDimensions.width,
                    height: screenDimensions.height,
                  }}
                  resizeMode="contain"
                  onLoadStart={() => setIsModalImageLoading(true)}
                  onLoadEnd={() => setIsModalImageLoading(false)}
                  onError={() => setIsModalImageLoading(false)}
                />
              </Zoomable>
            </GestureHandlerRootView>
          )}
        </View>
      </Modal>
    </>
  );
};
