import { Slot } from "expo-router";
import { SessionProvider } from "../components/SessionProvider";
import { QueryClient, QueryClientProvider } from "react-query";
import "../global.css";
import Toast from "react-native-toast-message";
import toastConfig from "@/components/toast-config";

const queryClient = new QueryClient();

export default function Layout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <Slot />
      </SessionProvider>
      <Toast config={toastConfig} />
    </QueryClientProvider>
  );
}
