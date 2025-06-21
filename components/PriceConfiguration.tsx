import { formatPrice } from "@/lib/format";
import { EVENTS_DURATION } from "@/lib/consts/events";
import { usePriceSettings } from "@/lib/price-settings";
import {
  ScrollView,
  Text,
  TextInput,
  View,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useState } from "react";
import { MoneyIcon, GearIcon } from "./Icons";
import Toast from "react-native-toast-message";

export const PriceConfiguration = () => {
  const { prices, updatePrice, resetToDefaults, isLoading } =
    usePriceSettings();
  const [editingValues, setEditingValues] = useState<{
    [key: number]: string;
  }>({});

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#fff" />
        <Text className="text-white mt-4">Cargando configuración...</Text>
      </View>
    );
  }

  const handlePriceChange = (duration: number, value: string) => {
    setEditingValues((prev) => ({
      ...prev,
      [duration]: value,
    }));
  };

  const savePriceChange = async (duration: number) => {
    const newValue = editingValues[duration];
    if (newValue === undefined) return;

    const numericValue = parseInt(newValue.replace(/[^0-9]/g, ""));
    if (isNaN(numericValue) || numericValue < 0) {
      Alert.alert("Error", "Por favor ingresa un precio válido");
      return;
    }

    try {
      await updatePrice(duration, numericValue);
      setEditingValues((prev) => {
        const updated = { ...prev };
        delete updated[duration];
        return updated;
      });
      Toast.show({
        type: "success",
        text1: "Precio actualizado",
        text2: `El precio para ${duration} minutos ha sido actualizado`,
      });
    } catch {
      Alert.alert("Error", "No se pudo guardar el precio");
    }
  };

  const cancelEdit = (duration: number) => {
    setEditingValues((prev) => {
      const updated = { ...prev };
      delete updated[duration];
      return updated;
    });
  };

  const handleResetToDefaults = () => {
    Alert.alert(
      "Restablecer precios",
      "¿Estás seguro de que quieres restablecer todos los precios a los valores por defecto?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Restablecer",
          style: "destructive",
          onPress: async () => {
            try {
              await resetToDefaults();
              setEditingValues({});
              Toast.show({
                type: "success",
                text1: "Precios restablecidos",
                text2:
                  "Todos los precios han sido restablecidos a los valores por defecto",
              });
            } catch {
              Alert.alert("Error", "No se pudieron restablecer los precios");
            }
          },
        },
      ],
    );
  };

  return (
    <ScrollView className="flex-1 p-4">
      <View className="mb-6">
        <View className="flex-row items-center gap-3 mb-4">
          <GearIcon size={24} />
          <Text className="text-white text-2xl font-bold">
            Configuración de Precios
          </Text>
        </View>
        <Text className="text-white/70 text-base leading-6">
          Configura los precios para cada duración de evento. Estos precios se
          aplicarán automáticamente al crear nuevos eventos.
        </Text>
      </View>

      <View className="bg-white/10 rounded-lg p-4 mb-6">
        {EVENTS_DURATION.map((duration) => {
          const isEditing = editingValues[duration.value] !== undefined;
          const currentPrice = prices[duration.value] || 0;
          const displayValue = isEditing
            ? editingValues[duration.value]
            : formatPrice(currentPrice);

          return (
            <View
              key={duration.value}
              className="flex-row items-center justify-between py-3 border-b border-white/20 last:border-b-0"
            >
              <View className="flex-1">
                <Text className="text-white text-lg font-medium">
                  {duration.label}
                </Text>
              </View>

              <View className="flex-row items-center gap-3">
                <MoneyIcon size={20} color="white" />
                {isEditing ? (
                  <View className="flex-row items-center gap-2">
                    <TextInput
                      className="text-white text-lg bg-white/20 px-3 py-2 rounded-md min-w-[120px] text-right"
                      value={editingValues[duration.value]}
                      onChangeText={(value) =>
                        handlePriceChange(duration.value, value)
                      }
                      placeholder="0"
                      placeholderTextColor="rgba(255, 255, 255, 0.5)"
                      keyboardType="numeric"
                      autoFocus
                    />
                    <Pressable
                      onPress={() => savePriceChange(duration.value)}
                      className="bg-green-600 px-3 py-2 rounded-md"
                    >
                      <Text className="text-white text-sm font-medium">✓</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => cancelEdit(duration.value)}
                      className="bg-red-600 px-3 py-2 rounded-md"
                    >
                      <Text className="text-white text-sm font-medium">✕</Text>
                    </Pressable>
                  </View>
                ) : (
                  <Pressable
                    onPress={() =>
                      handlePriceChange(duration.value, String(currentPrice))
                    }
                    className="min-w-[120px]"
                  >
                    <Text className="text-white text-lg text-right">
                      {displayValue}
                    </Text>
                  </Pressable>
                )}
              </View>
            </View>
          );
        })}
      </View>

      <Pressable
        onPress={handleResetToDefaults}
        className="bg-red-600/20 border border-red-600 rounded-lg p-4 mb-4"
      >
        <Text className="text-red-400 text-center text-lg font-medium">
          Restablecer a valores por defecto
        </Text>
      </Pressable>

      <View className="bg-blue-600/20 border border-blue-600 rounded-lg p-4">
        <Text className="text-blue-400 text-sm leading-5">
          💡 Los precios configurados aquí se aplicarán automáticamente como
          valores por defecto al crear nuevos eventos. Siempre podrás modificar
          el precio individualmente para cada evento.
        </Text>
      </View>
    </ScrollView>
  );
};
