import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

type Props = {
  defaultDate?: Date;
  onChange: (date: Date) => void;
};

export const DateTimeInput = ({ defaultDate, onChange }: Props) => {
  const [date, setDate] = useState(defaultDate || new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
    onChange(currentDate);
  };

  return (
    <View className="flex-row gap-x-4">
      <DateTimePicker
        value={date}
        mode="datetime"
        is24Hour={true}
        onChange={onDateChange}
      />
    </View>
  );
};
