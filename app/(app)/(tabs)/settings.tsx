import { GoogleSheetsConfig } from "@/components/google-sheets-config";
import { LogoutButton } from "@/components/logout-button";
import { Screen } from "@/components/Screen";
import { PriceConfiguration } from "@/components/PriceConfiguration";
import { ScrollView, Text, View } from "react-native";

export default function Settings() {
  return (
    <Screen>
      <ScrollView className="flex-1">
        <View className="py-6">
          <Text className="text-white text-2xl font-bold text-center mb-6">
            Configuración
          </Text>

          <GoogleSheetsConfig />

          <PriceConfiguration />

          <LogoutButton />
        </View>
      </ScrollView>
    </Screen>
  );
}
