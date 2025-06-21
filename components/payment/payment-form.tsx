import { DateTimeInput } from "@/components/form/date-time-input";
import { Select } from "@/components/form/select";
import { TextInputField } from "@/components/form/text-input";
import { useSession } from "@/components/SessionProvider";
import usePaymentForm from "@/hooks/usePaymentForm";
import { appendToSpreadsheet } from "@/lib/google/sheets";
import { PAYMENT_METHODS, SERVICES } from "@/types/payment";
import { Alert, Pressable, Text, View } from "react-native";
import Toast from "react-native-toast-message";

type Props = {
  spreadsheetId: string;
};

export const PaymentForm = ({ spreadsheetId }: Props) => {
  const { session } = useSession();
  const {
    updateDate,
    updatePaymentMethod,
    updateDescription,
    updateAmount,
    updateService,
    updateClientId,
    reset,
    ...state
  } = usePaymentForm();

  const { date, paymentMethod, description, amount, service, clientId } = state;

  const handleSubmit = async () => {
    if (!session?.accessToken) {
      Alert.alert("Error", "No hay sesión activa");
      return;
    }

    if (!description.trim()) {
      Alert.alert("Error", "La descripción es requerida");
      return;
    }

    if (amount <= 0) {
      Alert.alert("Error", "El monto debe ser mayor a 0");
      return;
    }

    try {
      const paymentData = [
        [
          new Date(date).toLocaleDateString("es-AR"),
          paymentMethod,
          description,
          amount.toString(),
          service,
          clientId || "",
        ],
      ];

      await appendToSpreadsheet(
        spreadsheetId,
        "Payments!A:F",
        paymentData,
        session.accessToken,
      );

      Toast.show({
        type: "success",
        text1: "Pago guardado",
        text2: "El pago se guardó exitosamente en Google Sheets",
      });

      reset();
    } catch (error) {
      console.error("Error saving payment:", error);
      Toast.show({
        type: "error",
        text1: "Error al guardar",
        text2: "No se pudo guardar el pago. Intenta nuevamente.",
      });
    }
  };

  return (
    <View className="bg-gray-800 rounded-lg p-6 mx-4">
      <Text className="text-white text-xl font-bold text-center mb-6">
        Registrar Pago
      </Text>

      <DateTimeInput
        label="Fecha"
        defaultDate={new Date(date)}
        onChange={(selectedDate) => updateDate(selectedDate.toISOString())}
      />

      <Select
        label="Método de Pago"
        value={paymentMethod}
        options={[...PAYMENT_METHODS]}
        onChange={(value) =>
          updatePaymentMethod(value as (typeof PAYMENT_METHODS)[number])
        }
      />

      <TextInputField
        label="Descripción"
        value={description}
        onChange={updateDescription}
        placeholder="Descripción del pago"
        multiline
      />

      <TextInputField
        label="Monto"
        value={amount.toString()}
        onChange={(value) => updateAmount(Number(value) || 0)}
        placeholder="0"
        keyboardType="numeric"
      />

      <Select
        label="Servicio"
        value={service}
        options={[...SERVICES]}
        onChange={(value) => updateService(value as (typeof SERVICES)[number])}
      />

      <TextInputField
        label="ID del Cliente (Opcional)"
        value={clientId || ""}
        onChange={updateClientId}
        placeholder="ID del cliente"
      />

      <Pressable
        onPress={handleSubmit}
        className="bg-blue-600 hover:bg-blue-700 rounded-lg py-4 px-6 mt-4"
      >
        <Text className="text-white text-center font-semibold text-lg">
          Guardar Pago
        </Text>
      </Pressable>
    </View>
  );
};
