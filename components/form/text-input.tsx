import { Text, TextInput, View } from "react-native";

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
};

export const TextInputField = ({
  label,
  value,
  onChange,
  placeholder,
  multiline = false,
  keyboardType = "default",
}: Props) => {
  return (
    <View className="mb-4">
      <Text className="text-white text-base font-medium mb-2">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        multiline={multiline}
        keyboardType={keyboardType}
        className="bg-gray-700 text-white rounded-lg border border-gray-600 px-4 py-3"
        style={{
          minHeight: multiline ? 80 : 48,
          textAlignVertical: multiline ? "top" : "center",
        }}
      />
    </View>
  );
};
