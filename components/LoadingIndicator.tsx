import { ActivityIndicator, View } from "react-native";
import { Screen } from "./Screen";

export const LoadingIndicator = () => {
  return (
    <Screen>
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#fff" />
      </View>
    </Screen>
  );
};
