import { formatDateTime } from "@/lib/format";
import { EventType } from "@/types/event";
import { Zoomable } from "@likashefqet/react-native-image-zoom";
import { Image, Text, View, Pressable, Share, Alert } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaymentStatus } from "./payment-status";
import * as ImagePicker from "expo-image-picker";
import { CameraIcon, PhotoIcon, ShareIcon } from "@/components/Icons";

type Props = {
  event: EventType;
};

export const EventDetail = ({ event }: Props) => {
  const takePhoto = async () => {
    const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
    if (cameraStatus.status !== "granted") {
      alert("Sorry, we need these permissions to make this work!");
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 3],
      });
      if (!result.canceled) {
        console.log(result.assets[0].uri);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      console.log(result.assets[0].uri);
    }
  };

  const shareEvent = async () => {
    try {
      const result = await Share.share({
        message:
          "React Native | A framework for building native apps using React",
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
    } catch (error: any) {
      Alert.alert(error.message);
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
        <Text className="text-white text-xl">Precio: ${event.price}</Text>
        <Text className="text-white text-xl">Abonado: ${event.deposit}</Text>
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
              minPanPointers={1}
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
