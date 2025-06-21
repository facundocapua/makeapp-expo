import { Pressable, Text, TextInput, View } from "react-native";
import { PencilIcon, CheckCircleIcon, CrossCircleIcon } from "../Icons";
import { useState } from "react";

type Props = {
  icon?: React.ReactNode;
  label?: string;
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
};

export const EditableNotes = ({
  icon,
  label,
  value,
  placeholder = "Agregar notas...",
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
      <View className="p-4 bg-white/20 rounded-md self-start">
        {icon ?? ""}
      </View>
      <View className="flex flex-col flex-grow">
        {isEditing ? (
          <View className="flex flex-col">
            <TextInput
              className="text-white text-base bg-white/10 rounded-md p-3 min-h-[80px]"
              value={editValue}
              onChangeText={setEditValue}
              placeholder={placeholder}
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              multiline={true}
              textAlignVertical="top"
              autoFocus
            />
          </View>
        ) : (
          <Text className="text-white text-base">{value || placeholder}</Text>
        )}
      </View>
      <View className="self-start">
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
