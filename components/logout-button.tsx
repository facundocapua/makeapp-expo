import { useSession } from "@/components/SessionProvider";
import { router } from "expo-router";
import { Alert, Pressable, Text, View } from "react-native";
import Toast from "react-native-toast-message";

export const LogoutButton = () => {
  const { signOut, session } = useSession();

  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres cerrar sesión? Se perderá la configuración local.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Cerrar Sesión",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut();
              Toast.show({
                type: "success",
                text1: "Sesión cerrada",
                text2: "Has cerrado sesión exitosamente",
              });
              router.push("/");
            } catch {
              Toast.show({
                type: "error",
                text1: "Error",
                text2: "No se pudo cerrar la sesión completamente",
              });
            }
          },
        },
      ],
    );
  };

  if (!session) {
    return null;
  }

  return (
    <View className="bg-gray-800 rounded-lg p-6 mx-4 mt-4">
      <Text className="text-white text-lg font-bold mb-4">Cuenta</Text>

      <View className="mb-4">
        <Text className="text-gray-300 text-sm mb-2">
          Usuario: {session.user.email}
        </Text>
        <Text className="text-gray-300 text-sm">
          Nombre: {session.user.name}
        </Text>
      </View>

      <Pressable
        onPress={handleLogout}
        className="bg-red-600 hover:bg-red-700 rounded-lg py-3 px-4"
      >
        <Text className="text-white text-center font-medium">
          Cerrar Sesión
        </Text>
      </Pressable>
    </View>
  );
};
