import { Pressable, Text, View } from "react-native";
import {
  PencilIcon,
  CheckCircleIcon,
  CrossCircleIcon,
  CalendarIcon,
} from "../Icons";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";

type Props = {
  label?: string;
  value?: string | Date;
  format?: (value: string | Date) => string;
  onChange?: (value: Date) => void;
};

export const EditableDate = ({ label, value, format, onChange }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(() => {
    if (value instanceof Date) return value;
    if (typeof value === "string") return new Date(value);
    return new Date();
  });
  const [originalValue, setOriginalValue] = useState(() => {
    if (value instanceof Date) return value;
    if (typeof value === "string") return new Date(value);
    return new Date();
  });

  const startEditing = () => {
    const currentDate =
      value instanceof Date ? value : new Date(value || new Date());
    setOriginalValue(currentDate);
    setEditValue(currentDate);
    setIsEditing(true);
  };

  const confirmEdit = () => {
    if (onChange) {
      onChange(editValue);
    }
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setEditValue(originalValue);
    setIsEditing(false);
  };

  const onDateChange = (event: unknown, selectedDate?: Date) => {
    if (selectedDate) {
      setEditValue(selectedDate);
    }
  };

  return (
    <View className="flex flex-row gap-4">
      <View className="p-4 bg-white/20 rounded-md">
        <CalendarIcon />
      </View>
      <View className="flex flex-col flex-grow">
        <Text className="text-white/70 text-lg">{label}</Text>
        {isEditing ? (
          <View className="flex flex-col">
            <DateTimePicker
              value={editValue}
              mode="datetime"
              onChange={onDateChange}
              textColor="white"
              themeVariant="dark"
              locale="es-AR"
              display="default"
              minuteInterval={15}
            />
          </View>
        ) : (
          <Text className="text-white text-2xl">
            {format ? format(value || new Date()) : String(value)}
          </Text>
        )}
      </View>
      <View className="self-center">
        {isEditing ? (
          <View className="flex flex-row gap-4">
            <Pressable onPress={confirmEdit}>
              <CheckCircleIcon size={32} color="#10b981" />
            </Pressable>
            <Pressable onPress={cancelEdit}>
              <CrossCircleIcon size={32} color="#ef4444" />
            </Pressable>
          </View>
        ) : (
          <Pressable onPress={startEditing}>
            <PencilIcon />
          </Pressable>
        )}
      </View>
    </View>
  );
};
