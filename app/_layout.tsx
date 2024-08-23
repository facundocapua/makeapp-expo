import { Slot } from "expo-router";
import { SessionProvider } from "../components/SessionProvider";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

export default function Layout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <Slot />
      </SessionProvider>
    </QueryClientProvider>
  );
}
