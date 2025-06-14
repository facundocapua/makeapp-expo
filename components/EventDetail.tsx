import {
  formatDateShort,
  formatDateTime,
  formatPrice,
  formatTime,
} from "@/lib/format";
import { EventType } from "@/types/event";
import { Zoomable } from "@likashefqet/react-native-image-zoom";
import { Image, Text, View, Pressable, Share } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaymentStatus } from "./payment-status";
import * as ImagePicker from "expo-image-picker";
import { CameraIcon, PhotoIcon, ShareIcon } from "@/components/Icons";
import { fetchImageFromUri, uploadFile } from "@/lib/uploads";
import { useSession } from "./SessionProvider";

type Props = {
  event: EventType;
  onChange: (event: EventType) => void;
};

const getBalanceText = (balance: number, price: number) => {
  if (price === 0) return "";
  if (balance > 0) return `Te resta abonar 💰 *${formatPrice(balance)}*.`;
  return "Ya tienes el total abonado.";
};

export const EventDetail = ({ event, onChange }: Props) => {
  const { session } = useSession();
  const takePhoto = async () => {
    const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
    if (cameraStatus.status !== "granted") {
      alert("Sorry, we need these permissions to make this work!");
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        aspect: [4, 3],
      });
      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        const file = await fetchImageFromUri(imageUri);

        uploadFile(file, session?.accessToken ?? "").then((data) => {
          if (!data) return;
          onChange({ ...event, picture: data.url });
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      const file = await fetchImageFromUri(imageUri);

      uploadFile(file, session?.accessToken ?? "").then((data) => {
        if (!data) return;
        onChange({ ...event, picture: data.url });
      });
    }
  };

  const shareEvent = async () => {
    const { fullName, date, price, deposit } = event;

    const day = formatDateShort(date);
    const time = formatTime(date);
    const balance = Math.round(price - deposit);
    const url = "https://app.makeapp.ar/date-new.jpg";

    const result = await Share.share({
      title: "Tu turno",
      url,
      message: `Hola ${fullName}! 
Tu cita es el 🗓️ *${day}* a las 🕐 *${time}*. 
${getBalanceText(balance, price)}

Confirmar assistencia. 
Muchas gracias!
`,
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  };

  return (
    <View className="flex-1 flex-col h-full">
      <View className="m-2 flex-grow">
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
        <Pressable onPress={shareEvent}>
          <View className="flex-col items-center gap-2">
            <ShareIcon />
            <Text className="text-white text-xs">Compartir cita</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
};
