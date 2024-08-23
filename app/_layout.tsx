import { Slot } from "expo-router";
import { SessionProvider } from "../components/SessionProvider";

export default function Layout() {
  return (
    <SessionProvider>
      <Slot />
    </SessionProvider>
  );
}
