import { formatPrice } from "@/lib/format";
import { EventType } from "@/types/event";
import { Text, View } from "react-native";
import { CheckCircleIcon, WarningIcon, ClockIcon } from "./Icons";

type Props = {
  event: EventType;
};

export const PaymentStatus = ({ event }: Props) => {
  const { deposit, price } = event;
  const depositAmount = Number(deposit ?? 0);
  const totalAmount = Number(price ?? 0);
  const pending = totalAmount - depositAmount;
  const paymentPercentage =
    totalAmount > 0 ? (depositAmount / totalAmount) * 100 : 0;

  // Estado: Pagado completamente
  if (pending === 0 && totalAmount > 0) {
    return (
      <View className="flex flex-col bg-green-500/20 rounded-lg p-4 border-l-4 border-green-500">
        <View className="flex flex-row items-center gap-3 mb-2">
          <CheckCircleIcon size={24} color="#10b981" />
          <Text className="text-green-400 text-lg font-bold">
            Pago Completo
          </Text>
        </View>
        <Text className="text-green-300 text-sm">
          Monto total: {formatPrice(totalAmount)}
        </Text>
        <View className="w-full bg-green-900/30 rounded-full h-2 mt-2">
          <View className="w-full bg-green-500 h-2 rounded-full" />
        </View>
      </View>
    );
  }

  // Estado: No ha abonado nada
  if (depositAmount === 0) {
    return (
      <View className="flex flex-col bg-red-500/20 rounded-lg p-4 border-l-4 border-red-500">
        <View className="flex flex-row items-center gap-x-4">
          <View className="flex flex-row items-center gap-3 mb-2">
            <WarningIcon size={24} color="#ef4444" />
            <Text className="text-red-400 text-lg font-bold">Sin Abono</Text>
          </View>
          <Text className="text-red-300 text-sm mb-1">
            Debe abonar: {formatPrice(totalAmount)}
          </Text>
        </View>
        <View className="w-full bg-red-900/30 rounded-full h-2 mt-2">
          <View className="w-0 bg-red-500 h-2 rounded-full" />
        </View>
      </View>
    );
  }

  // Estado: Abono parcial
  return (
    <View className="flex flex-col bg-yellow-500/20 rounded-lg p-4 border-l-4 border-yellow-500">
      <View className="flex flex-row gap-x-4 items-center">
        <View className="flex flex-row items-center gap-3 mb-2">
          <ClockIcon size={24} color="#f59e0b" />
          <Text className="text-yellow-400 text-lg font-bold">
            Abono Parcial
          </Text>
        </View>
        <Text className="text-yellow-300 text-sm mb-1">
          Restante: {formatPrice(pending)} •{" "}
          {Math.round(100 - paymentPercentage)}% del total
        </Text>
      </View>
      <View className="w-full bg-yellow-900/30 rounded-full h-2">
        <View
          className="bg-yellow-500 h-2 rounded-full"
          style={{ width: `${paymentPercentage}%` }}
        />
      </View>
    </View>
  );
};
