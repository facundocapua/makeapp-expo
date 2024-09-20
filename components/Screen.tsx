import { Keyboard, TouchableWithoutFeedback, View } from "react-native";

type Props = {
  children: React.ReactNode;
};

export function Screen({ children }: Props) {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-black pt-4">{children}</View>
    </TouchableWithoutFeedback>
  );
}
