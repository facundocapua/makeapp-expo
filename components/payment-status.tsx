import { formatPrice } from "@/lib/format";
import { EventType } from "@/types/event";
import { Text } from "react-native";

type Props = {
  event: EventType;
};

export const PaymentStatus = ({ event }: Props) => {
  const { deposit, price } = event;
  const pending = Number(price ?? 0) - Number(deposit ?? 0);

  if (pending === 0) {
    return <Text className="text-green-500 text-xl">Pagado</Text>;
  }

  return (
    <Text className="text-red-400 text-xl">
      Pendiente <Text className="font-bold">{formatPrice(pending)}</Text>
    </Text>
  );
};
