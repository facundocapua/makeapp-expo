import { Link, Stack } from "expo-router";
import { ActivityIndicator, Pressable, View } from "react-native";
import { CircleInfoIcon } from "../../components/Icons";
import { Logo } from "../../components/Logo";
import { useSession } from "../../components/SessionProvider";
import { Login } from "../../components/Login";
import { useEffect } from "react";

export default function MainLayout() {
  const { session, isLoading, signIn } = useSession();

  useEffect(() => {
    signIn();
  }, [signIn]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!session) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <Login />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#000",
          },
          headerTintColor: "#fff",
          headerTitle: "",
          headerLeft: () => <Logo />,
          headerRight: () => (
            <Link href="/about" asChild>
              <Pressable>
                <CircleInfoIcon />
              </Pressable>
            </Link>
          ),
        }}
      />
    </View>
  );
}
