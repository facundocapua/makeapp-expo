import { Text, TextInput, View } from "react-native";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { PaymentStatus } from "../payment-status";
import { EventType } from "@/types/event";
import { EVENTS_DURATION, EVENTS_PRICES } from "@/lib/consts/events";

type EventForm = {
  fullName: string;
  date: Date;
  duration: number;
  price?: number;
  deposit?: number;
};

const defaultEventInfo: EventForm = {
  fullName: "",
  date: new Date(),
  duration: 60,
  price: EVENTS_PRICES[60],
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

  const setDuration = (duration: number) => {
    const price =
      EVENTS_PRICES[duration as keyof typeof EVENTS_PRICES] ?? undefined;

    console.log("Setting default price:", price, duration);
    setValue({ price, duration });
  };

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
        <View className="mx-4">
          <Text className="text-white text-xl">Duración</Text>
          <Picker
            mode="dialog"
            selectionColor={"#fff"}
            selectedValue={eventInfo.duration}
            onValueChange={(itemValue) => {
              setDuration(itemValue);
            }}
            itemStyle={{ color: "white" }}
            dropdownIconColor={"white"}
            style={{ color: "white" }}
          >
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
      <View className="mx-4 mb-4 bg-white/30 rounded-md">
        <View className="mx-4">
          <TextInput
            className="text-white text-lg my-2"
            placeholderTextColor={"#999"}
            placeholder="Precio"
            value={String(eventInfo.price ?? "")}
            onChangeText={(text) =>
              setValue({ price: text ? Number(text) : undefined })
            }
            keyboardType="numeric"
            inputMode="numeric"
          />
        </View>
        <View className="mx-4 border-t border-t-neutral-500">
          <TextInput
            className="text-white text-lg my-2"
            placeholderTextColor={"#999"}
            placeholder="Seña"
            value={String(eventInfo.deposit ?? "")}
            onChangeText={(text) =>
              setValue({ deposit: text ? Number(text) : undefined })
            }
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
