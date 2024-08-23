import { Image, View } from "react-native";
import logo from "../assets/logo.png";

export function Logo() {
  return (
    <View>
      <Image source={logo} style={{ width: 120, height: 30 }} />
    </View>
  );
}
