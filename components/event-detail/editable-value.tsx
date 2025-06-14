import { Pressable, Text, TextInput, View } from "react-native";
import { PencilIcon, CheckCircleIcon, CrossCircleIcon } from "../Icons";
import { useState } from "react";

type Props = {
  icon?: React.ReactNode;
  label?: string;
  value?: string | number;
  format?: (value: string | number) => string;
  onChange?: (value: string | number) => void;
};

export const EditableValue = ({
  icon,
  label,
  value,
  format,
  onChange,
}: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value || "");

  const startEditing = () => {
    setEditValue(value || "");
    setIsEditing(true);
  };

  const confirmEdit = () => {
    if (onChange) {
      onChange(editValue);
    }
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setIsEditing(false);
  };

  return (
    <View className="flex flex-row gap-4">
      <View className="p-4 bg-white/20 rounded-md">{icon ?? ""}</View>
      <View className="flex flex-col flex-grow">
        <Text className="text-white/70 text-lg">{label}</Text>
        {isEditing ? (
          <View className="flex flex-row items-center">
            <TextInput
              className="text-white text-2xl flex-grow"
              value={String(editValue)}
              onChangeText={setEditValue}
              autoFocus
            />
          </View>
        ) : (
          <Text className="text-white text-2xl">
            {format ? format(value ?? "") : value}
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
