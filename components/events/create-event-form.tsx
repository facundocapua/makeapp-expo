import { Text, TextInput, View } from "react-native";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { PaymentStatus } from "../payment-status";
import { EventType } from "@/types/event";
import { EVENTS_DURATION } from "@/lib/consts/events";
import { usePriceSettings } from "@/lib/price-settings";
import { formatDateTime, formatPrice } from "@/lib/format";
import { CalendarIcon, MoneyIcon, ClockIcon, FileTextIcon } from "../Icons";

type EventForm = {
  fullName: string;
  date: Date;
  duration: number;
  price?: number;
  deposit?: number;
};

type Props = {
  onChange: (data: EventType) => void;
};

export const CreateEventForm = ({ onChange }: Props) => {
  const { prices } = usePriceSettings();

  const defaultEventInfo: EventForm = {
    fullName: "",
    date: new Date(),
    duration: 0,
  };

  const [eventInfo, setEventInfo] = useState<EventForm>(defaultEventInfo);
  const setValue = (newData: Partial<EventForm>) => {
    const newEventInfo = { ...eventInfo, ...newData };
    setEventInfo(newEventInfo);
    onChange(newEventInfo as EventType);
  };
  const minDate = new Date();
  minDate.setHours(0);
  minDate.setMinutes(0);
  minDate.setSeconds(0);

  const setDuration = (duration: number) => {
    const price = prices[duration] ?? undefined;

    console.log("Setting default price:", price, duration);
    setValue({ price, duration });
  };

  return (
    <View className="flex flex-col gap-6 p-4">
      {/* Nombre */}
      <View className="flex flex-row gap-4">
        <View className="p-4 bg-white/20 rounded-md">
          <FileTextIcon />
        </View>
        <View className="flex flex-col flex-grow">
          <Text className="text-white/70 text-lg">Nombre</Text>
          <TextInput
            className="text-white text-2xl"
            placeholderTextColor="#999"
            autoFocus
            placeholder="Ingresa el nombre completo"
            value={eventInfo.fullName}
            onChangeText={(text) => setValue({ fullName: text })}
          />
        </View>
      </View>

      {/* Fecha y hora */}
      <View className="flex flex-row gap-4">
        <View className="p-4 bg-white/20 rounded-md">
          <CalendarIcon />
        </View>
        <View className="flex flex-col flex-grow gap-y-2">
          <Text className="text-white/70 text-lg">Fecha y hora</Text>
          <RNDateTimePicker
            value={eventInfo.date}
            mode="datetime"
            onChange={(e, value) => {
              setValue({ date: value });
            }}
            textColor="white"
            themeVariant="dark"
            locale="es-AR"
            display="default"
            minuteInterval={15}
            minimumDate={minDate}
          />
        </View>
      </View>

      {/* Duración */}
      <View className="flex flex-row gap-4">
        <View className="p-4 bg-white/20 rounded-md">
          <ClockIcon />
        </View>
        <View className="flex flex-col flex-grow">
          <Text className="text-white/70 text-lg">Duración</Text>
          <Picker
            mode="dialog"
            selectionColor="#fff"
            selectedValue={eventInfo.duration}
            onValueChange={(itemValue) => {
              setDuration(itemValue);
            }}
            itemStyle={{ color: "white" }}
            dropdownIconColor="white"
            style={{ color: "white" }}
          >
            <Picker.Item value={0} label="Seleccionar duración" color="white" />
            {EVENTS_DURATION.map((duration) => (
              <Picker.Item
                key={duration.value}
                value={duration.value}
                label={duration.label}
                color="white"
              />
            ))}
          </Picker>
        </View>
      </View>

      {/* Precio */}
      <View className="flex flex-row gap-4">
        <View className="p-4 bg-white/20 rounded-md">
          <MoneyIcon />
        </View>
        <View className="flex flex-col flex-grow">
          <Text className="text-white/70 text-lg">Precio</Text>
          <TextInput
            className="text-white text-2xl"
            placeholderTextColor="#999"
            placeholder="0"
            value={String(eventInfo.price ?? "")}
            onChangeText={(text) =>
              setValue({ price: text ? Number(text) : undefined })
            }
            keyboardType="numeric"
            inputMode="numeric"
          />
        </View>
      </View>

      {/* Seña */}
      <View className="flex flex-row gap-4">
        <View className="p-4 bg-white/20 rounded-md">
          <MoneyIcon />
        </View>
        <View className="flex flex-col flex-grow">
          <Text className="text-white/70 text-lg">Abonado</Text>
          <TextInput
            className="text-white text-2xl"
            placeholderTextColor="#999"
            placeholder="0"
            value={String(eventInfo.deposit ?? "")}
            onChangeText={(text) =>
              setValue({ deposit: text ? Number(text) : undefined })
            }
            keyboardType="numeric"
            inputMode="numeric"
          />
        </View>
      </View>

      {/* Estado de pago */}
      <View className="py-2">
        <PaymentStatus event={eventInfo as EventType} />
      </View>
    </View>
  );
};
