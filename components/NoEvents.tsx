import { Text, View } from "react-native";
import { Screen } from "./Screen";

export const NoEvents = () => {
  return (
    <Screen>
      <View className="flex-1 justify-center items-center">
        <Text className="text-white text-xl">No se encontraron eventos</Text>
      </View>
    </Screen>
  );
};
