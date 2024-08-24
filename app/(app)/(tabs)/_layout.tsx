import { Tabs } from "expo-router";

import {
  ArchiveIcon,
  CalendarIcon,
  GearIcon,
  MoneyIcon,
} from "../../../components/Icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "#000",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Calendario",
          tabBarIcon: ({ color }) => <CalendarIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="archive"
        options={{
          title: "Archivo",
          tabBarIcon: ({ color }) => <ArchiveIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="income"
        options={{
          title: "Ingresos",
          tabBarIcon: ({ color }) => <MoneyIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Configuración",
          tabBarIcon: ({ color }) => <GearIcon color={color} />,
        }}
      />
    </Tabs>
  );
}
