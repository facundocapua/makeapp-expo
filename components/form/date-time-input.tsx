import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Text, View } from "react-native";

type Props = {
  label?: string;
  defaultDate?: Date;
  onChange: (date: Date) => void;
};

export const DateTimeInput = ({ label, defaultDate, onChange }: Props) => {
  const [date, setDate] = useState(defaultDate || new Date());

  const onDateChange = (event: unknown, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    onChange(currentDate);
  };

  return (
    <View className="mb-4">
      {label && (
        <Text className="text-white text-base font-medium mb-2">{label}</Text>
      )}
      <View className="flex-row gap-x-4">
        <DateTimePicker value={date} mode="datetime" onChange={onDateChange} />
      </View>
    </View>
  );
};
