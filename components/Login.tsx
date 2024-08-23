import {
  GoogleSignin,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";
import { View } from "react-native";
import { useSession } from "./SessionProvider";
import { getCalendar } from "@/lib/google/calendar";
import { CALENDAR_NAME } from "@/lib/google/utils";

export const Login = () => {
  const { setSession } = useSession();
  const signIn = async () => {
    try {
      GoogleSignin.configure({
        scopes: [
          "https://www.googleapis.com/auth/userinfo.email",
          "https://www.googleapis.com/auth/userinfo.profile",
          "https://www.googleapis.com/auth/calendar",
          "https://www.googleapis.com/auth/spreadsheets",
        ], // what API you want to access on behalf of the user, default is email and profile
        iosClientId:
          "85456588535-kn2999smr8u1g7oprt57lnckdpv8iuqo.apps.googleusercontent.com", // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
      });
      const userInfo = await GoogleSignin.signIn();
      const { accessToken } = await GoogleSignin.getTokens();
      const calendar = await getCalendar({
        name: CALENDAR_NAME,
        accessToken,
      });
      const calendarId = calendar.id;

      setSession({ ...userInfo, accessToken, calendarId });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View className="flex-1 items-center justify-center">
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={() => signIn()}
      />
    </View>
  );
};
