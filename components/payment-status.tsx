import { EventType } from "@/types/event";
import { Text } from "react-native";

type Props = {
  event: EventType;
};

export const PaymentStatus = ({ event }: Props) => {
  const { deposit, price } = event;
  const pending = price - deposit;

  if (pending === 0) {
    return <Text className="text-green-500 text-xl">Pagado</Text>;
  }

  return <Text className="text-red-600 text-xl">Pendiente ${pending}</Text>;
};
