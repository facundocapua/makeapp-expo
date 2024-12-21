import { Text, TextInput, View } from "react-native";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { PaymentStatus } from "../payment-status";
import { EventType } from "@/types/event";

type EventForm = {
  fullName: string;
  date: Date;
  duration: number;
  price: number;
  deposit: number;
};

const defaultEventInfo: EventForm = {
  fullName: "",
  date: new Date(),
  duration: 60,
  price: 0,
  deposit: 0,
};

type Props = {
  onChange: (data: EventType) => void;
};

export const CreateEventForm = ({ onChange }: Props) => {
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

  return (
    <View>
      <View className="m-4 bg-white/30 p-2 rounded-md">
        <TextInput
          className="text-white text-lg my-2"
          placeholderTextColor={"#999"}
          autoFocus
          placeholder="Nombre"
          value={eventInfo.fullName}
          onChangeText={(text) => setValue({ fullName: text })}
        />
      </View>

      <View className="mx-4 mb-4 bg-white/30 rounded-md">
        <View className="flex-row p-2 m-2 justify-between">
          <Text className="text-white text-xl">Fecha</Text>
          <RNDateTimePicker
            value={eventInfo.date}
            mode="datetime"
            onChange={(e, value) => setValue({ date: value })}
            textColor="white"
            themeVariant="dark"
            locale="es-AR"
            display="default"
            minuteInterval={15}
            minimumDate={minDate}
          />
        </View>
        <View className="mx-4">
          <Text className="text-white text-xl">Duración</Text>
          <Picker
            mode="dialog"
            selectionColor={"#fff"}
            selectedValue={eventInfo.duration}
            onValueChange={(itemValue) => setValue({ duration: itemValue })}
            itemStyle={{ color: "white" }}
            dropdownIconColor={"white"}
            style={{ color: "white" }}
          >
            <Picker.Item value="30" label="30 minutos" color="white" />
            <Picker.Item value="45" label="45 minutos" color="white" />
            <Picker.Item value="60" label="1 hora" color="white" />
            <Picker.Item value="90" label="1 hora 30 minutos" color="white" />
            <Picker.Item value="120" label="2 horas" color="white" />
          </Picker>
        </View>
      </View>
      <View className="mx-4 mb-4 bg-white/30 rounded-md">
        <View className="mx-4">
          <TextInput
            className="text-white text-lg my-2"
            placeholderTextColor={"#999"}
            placeholder="Precio"
            value={String(eventInfo.price)}
            onChangeText={(text) => setValue({ price: Number(text) })}
            keyboardType="numeric"
            inputMode="numeric"
          />
        </View>
        <View className="mx-4 border-t border-t-neutral-500">
          <TextInput
            className="text-white text-lg my-2"
            placeholderTextColor={"#999"}
            placeholder="Seña"
            value={String(eventInfo.deposit)}
            onChangeText={(text) => setValue({ deposit: Number(text) })}
            keyboardType="numeric"
            inputMode="numeric"
          />
        </View>
        <View className="mx-4 py-6">
          <View className="justify-between flex-row">
            <Text className="text-white text-lg">Estado del pago</Text>
            <PaymentStatus event={eventInfo as EventType} />
          </View>
        </View>
      </View>
    </View>
  );
};
