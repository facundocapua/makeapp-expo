import * as ImagePicker from "expo-image-picker";
import { fetchImageFromUri, uploadFile } from "@/lib/uploads";
import { EventType } from "@/types/event";
import { formatDateShort, formatTime, formatPrice } from "@/lib/format";
import { Share } from "react-native";

export const createUploadImage = (
  accessToken: string,
  event: EventType,
  onUpload: (event: EventType) => void,
) => {
  const fn = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      const file = await fetchImageFromUri(imageUri);

      uploadFile(file, accessToken).then((data) => {
        if (!data) return;
        onUpload({ ...event, picture: data.url });
      });
    }
  };

  return fn;
};

export const createTakePhoto = (
  accessToken: string,
  event: EventType,
  onUpload: (event: EventType) => void,
) => {
  const fn = async () => {
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

        uploadFile(file, accessToken).then((data) => {
          if (!data) return;
          onUpload({ ...event, picture: data.url });
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  return fn;
};

const getBalanceText = (balance: number, price: number) => {
  if (price === 0) return "";
  if (balance > 0) return `Te resta abonar 💰 *${formatPrice(balance)}*.`;
  return "Ya tienes el total abonado.";
};

export const shareEvent = async (event: EventType) => {
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
