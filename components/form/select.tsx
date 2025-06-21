import { Picker } from "@react-native-picker/picker";
import { Text, View } from "react-native";

type Option = {
  label: string;
  value: string;
};

type Props = {
  label: string;
  value: string;
  options: readonly string[] | Option[];
  onChange: (value: string) => void;
  placeholder?: string;
};

export const Select = ({
  label,
  value,
  options,
  onChange,
  placeholder,
}: Props) => {
  return (
    <View className="mb-4">
      <Text className="text-white text-base font-medium mb-2">{label}</Text>
      <View className="bg-gray-700 rounded-lg border border-gray-600">
        <Picker
          selectedValue={value}
          onValueChange={onChange}
          style={{ color: "white" }}
          dropdownIconColor="white"
        >
          {placeholder && (
            <Picker.Item label={placeholder} value="" enabled={false} />
          )}
          {options.map((option, index) => {
            const optionValue =
              typeof option === "string" ? option : option.value;
            const optionLabel =
              typeof option === "string" ? option : option.label;
            return (
              <Picker.Item
                key={index}
                label={optionLabel}
                value={optionValue}
                color="white"
              />
            );
          })}
        </Picker>
      </View>
    </View>
  );
};
