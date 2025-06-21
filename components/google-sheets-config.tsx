import { useSession } from "@/components/SessionProvider";
import { SpreadsheetSelector } from "@/components/spreadsheet-selector";
import {
  createSpreadsheet,
  getSpreadsheet,
  initializeSpreadsheetHeaders,
  SPREADSHEET_NAME,
} from "@/lib/google/sheets";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import Toast from "react-native-toast-message";

const SPREADSHEET_ID_KEY = "makeapp_spreadsheet_id";

type Props = {
  onSpreadsheetConfigured?: (spreadsheetId: string | null) => void;
};

type ConfigMode = "none" | "create" | "select" | "configured";

export const GoogleSheetsConfig = ({ onSpreadsheetConfigured }: Props) => {
  const { session } = useSession();
  const [spreadsheetId, setSpreadsheetId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [mode, setMode] = useState<ConfigMode>("none");
  const [selectedExistingId, setSelectedExistingId] = useState<string>("");

  const checkExistingSpreadsheet = useCallback(async () => {
    try {
      const storedId = await AsyncStorage.getItem(SPREADSHEET_ID_KEY);
      if (storedId && session?.accessToken) {
        // Verify the spreadsheet still exists
        try {
          await getSpreadsheet(storedId, session.accessToken);
          setSpreadsheetId(storedId);
          setMode("configured");
          onSpreadsheetConfigured?.(storedId);
        } catch {
          // Spreadsheet doesn't exist anymore, clear it
          await AsyncStorage.removeItem(SPREADSHEET_ID_KEY);
          setMode("none");
        }
      } else {
        setMode("none");
      }
    } catch (error) {
      console.error("Error checking existing spreadsheet:", error);
      setMode("none");
    } finally {
      setChecking(false);
    }
  }, [session?.accessToken, onSpreadsheetConfigured]);

  useEffect(() => {
    checkExistingSpreadsheet();
  }, [checkExistingSpreadsheet]);

  const createNewSpreadsheet = async () => {
    if (!session?.accessToken) {
      Alert.alert("Error", "No hay sesión activa");
      return;
    }

    setLoading(true);
    try {
      const spreadsheet = await createSpreadsheet(
        SPREADSHEET_NAME,
        session.accessToken,
      );

      // Initialize headers
      await initializeSpreadsheetHeaders(
        spreadsheet.spreadsheetId,
        session.accessToken,
      );

      // Store the ID locally
      await AsyncStorage.setItem(SPREADSHEET_ID_KEY, spreadsheet.spreadsheetId);

      setSpreadsheetId(spreadsheet.spreadsheetId);
      setMode("configured");
      onSpreadsheetConfigured?.(spreadsheet.spreadsheetId);

      Toast.show({
        type: "success",
        text1: "Hoja de cálculo creada",
        text2: "Se creó exitosamente la hoja de cálculo en Google Sheets",
      });
    } catch (error) {
      console.error("Error creating spreadsheet:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudo crear la hoja de cálculo. Intenta nuevamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  const useExistingSpreadsheet = async () => {
    if (!session?.accessToken || !selectedExistingId) {
      Alert.alert("Error", "Selecciona una hoja de cálculo");
      return;
    }

    setLoading(true);
    try {
      // Verify the spreadsheet exists
      await getSpreadsheet(selectedExistingId, session.accessToken);

      // Initialize the Payments sheet and headers (will create if doesn't exist)
      await initializeSpreadsheetHeaders(
        selectedExistingId,
        session.accessToken,
      );

      // Store the ID locally
      await AsyncStorage.setItem(SPREADSHEET_ID_KEY, selectedExistingId);

      setSpreadsheetId(selectedExistingId);
      setMode("configured");
      onSpreadsheetConfigured?.(selectedExistingId);

      Toast.show({
        type: "success",
        text1: "Hoja de cálculo configurada",
        text2: "Se configuró exitosamente la hoja de cálculo existente",
      });
    } catch (error) {
      console.error("Error using existing spreadsheet:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudo configurar la hoja de cálculo. Intenta nuevamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetConfiguration = async () => {
    Alert.alert(
      "Resetear configuración",
      "¿Estás seguro de que quieres resetear la configuración de Google Sheets? Esto creará una nueva hoja de cálculo.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Resetear",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem(SPREADSHEET_ID_KEY);
            setSpreadsheetId(null);
            setMode("none");
            setSelectedExistingId("");
            onSpreadsheetConfigured?.(null);
          },
        },
      ],
    );
  };

  if (checking) {
    return (
      <View className="bg-gray-800 rounded-lg p-6 mx-4">
        <Text className="text-white text-center">
          Verificando configuración...
        </Text>
      </View>
    );
  }

  return (
    <View className="bg-gray-800 rounded-lg p-6 mx-4 mb-4">
      <Text className="text-white text-lg font-bold mb-4">
        Configuración de Google Sheets
      </Text>

      {mode === "configured" && spreadsheetId ? (
        <View>
          <Text className="text-green-400 mb-4">
            ✅ Hoja de cálculo configurada
          </Text>
          <Text className="text-gray-300 text-sm mb-4">
            ID: {spreadsheetId}
          </Text>
          <Pressable
            onPress={resetConfiguration}
            className="bg-red-600 hover:bg-red-700 rounded-lg py-3 px-4"
          >
            <Text className="text-white text-center font-medium">
              Cambiar Configuración
            </Text>
          </Pressable>
        </View>
      ) : mode === "none" ? (
        <View>
          <Text className="text-orange-400 mb-4">
            ⚠️ No hay hoja de cálculo configurada
          </Text>
          <Text className="text-gray-300 text-sm mb-6">
            Para registrar pagos, necesitas configurar una hoja de cálculo en
            Google Sheets.
          </Text>

          <View className="gap-4">
            <Pressable
              onPress={() => setMode("create")}
              className="bg-blue-600 hover:bg-blue-700 rounded-lg py-3 px-4"
            >
              <Text className="text-white text-center font-medium">
                Crear Nueva Hoja de Cálculo
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setMode("select")}
              className="bg-green-600 hover:bg-green-700 rounded-lg py-3 px-4"
            >
              <Text className="text-white text-center font-medium">
                Usar Hoja de Cálculo Existente
              </Text>
            </Pressable>
          </View>
        </View>
      ) : mode === "create" ? (
        <View>
          <Text className="text-blue-400 mb-4">
            📄 Crear nueva hoja de cálculo
          </Text>
          <Text className="text-gray-300 text-sm mb-4">
            Se creará una nueva hoja de cálculo llamada "{SPREADSHEET_NAME}" en
            tu Google Drive.
          </Text>

          <View className="gap-3">
            <Pressable
              onPress={createNewSpreadsheet}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 rounded-lg py-3 px-4"
            >
              <Text className="text-white text-center font-medium">
                {loading ? "Creando..." : "Confirmar Creación"}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setMode("none")}
              className="bg-gray-600 hover:bg-gray-700 rounded-lg py-3 px-4"
            >
              <Text className="text-white text-center font-medium">
                Cancelar
              </Text>
            </Pressable>
          </View>
        </View>
      ) : mode === "select" ? (
        <View>
          <Text className="text-green-400 mb-4">
            📋 Seleccionar hoja de cálculo existente
          </Text>
          <Text className="text-gray-300 text-sm mb-4">
            Selecciona una hoja de cálculo existente de tu Google Drive.
          </Text>

          {session?.accessToken && (
            <SpreadsheetSelector
              accessToken={session.accessToken}
              onSelect={setSelectedExistingId}
              selectedId={selectedExistingId}
            />
          )}

          <View className="gap-3">
            <Pressable
              onPress={useExistingSpreadsheet}
              disabled={loading || !selectedExistingId}
              className={`${
                !selectedExistingId || loading
                  ? "bg-gray-500"
                  : "bg-green-600 hover:bg-green-700"
              } rounded-lg py-3 px-4`}
            >
              <Text className="text-white text-center font-medium">
                {loading ? "Configurando..." : "Usar Esta Hoja"}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                setMode("none");
                setSelectedExistingId("");
              }}
              className="bg-gray-600 hover:bg-gray-700 rounded-lg py-3 px-4"
            >
              <Text className="text-white text-center font-medium">
                Cancelar
              </Text>
            </Pressable>
          </View>
        </View>
      ) : null}
    </View>
  );
};
