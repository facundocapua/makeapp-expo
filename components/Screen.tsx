import { View } from "react-native";

type Props = {
  children: React.ReactNode;
};

export function Screen({ children }: Props) {
  return <View className="flex-1 bg-black pt-4">{children}</View>;
}
