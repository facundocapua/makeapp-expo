import { Text, TextInput, View } from "react-native";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { PaymentStatus } from "../payment-status";
import { EventType } from "@/types/event";

const defaultEventInfo: EventType = {
  name: "",
  date: new Date(),
  duration: "60",
  price: "",
  deposit: "",
};

type Props = {
  onChange: (data: EventType) => void;
};

export const CreateEventForm = ({ onChange }: Props) => {
  const [eventInfo, setEventInfo] = useState<EventType>(defaultEventInfo);
  const setValue = (newData) => {
    const newEventInfo = { ...eventInfo, ...newData };
    setEventInfo(newEventInfo);
    onChange(newEventInfo);
  };
  return (
    <View>
      <View className="m-4 bg-white/30 p-2 rounded-md">
        <TextInput
          className="text-white text-lg my-2"
          placeholderTextColor={"#999"}
          autoFocus
          placeholder="Nombre"
          value={eventInfo.name}
          onChangeText={(text) => setValue({ name: text })}
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
            minimumDate={new Date()}
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
            value={eventInfo.price}
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
            value={eventInfo.deposit}
            onChangeText={(text) => setValue({ deposit: Number(text) })}
            keyboardType="numeric"
            inputMode="numeric"
          />
        </View>
        <View className="mx-4 py-6">
          <View className="justify-between flex-row">
            <Text className="text-white text-lg">Estado del pago</Text>
            <PaymentStatus event={eventInfo} />
          </View>
        </View>
      </View>
    </View>
  );
};
