import { GoogleSheetsConfig } from "@/components/google-sheets-config";
import { PaymentForm } from "@/components/payment/payment-form";
import { Screen } from "@/components/Screen";
import { useSession } from "@/components/SessionProvider";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";

export default function Income() {
  const { session } = useSession();
  const [spreadsheetId, setSpreadsheetId] = useState<string | null>(null);

  if (!session) {
    return (
      <Screen>
        <View className="flex-1 justify-center items-center">
          <Text className="text-white text-lg">
            Debes iniciar sesión para acceder a esta sección
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView className="flex-1">
        <View className="py-6">
          <Text className="text-white text-2xl font-bold text-center mb-6">
            Registro de Ingresos
          </Text>

          <GoogleSheetsConfig
            onSpreadsheetConfigured={(id) => setSpreadsheetId(id)}
          />

          {spreadsheetId ? (
            <PaymentForm spreadsheetId={spreadsheetId} />
          ) : (
            <View className="bg-orange-100 border border-orange-400 rounded-lg p-4 mx-4">
              <Text className="text-orange-800 text-center">
                Debes configurar una hoja de cálculo de Google Sheets antes de
                poder registrar pagos.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}
