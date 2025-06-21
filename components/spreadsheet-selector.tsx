import { Select } from "@/components/form/select";
import { DriveFileType, listSpreadsheets } from "@/lib/google/sheets";
import { useCallback, useEffect, useState } from "react";
import { Text, View } from "react-native";

type Props = {
  accessToken: string;
  onSelect: (spreadsheetId: string) => void;
  selectedId?: string;
};

export const SpreadsheetSelector = ({
  accessToken,
  onSelect,
  selectedId,
}: Props) => {
  const [spreadsheets, setSpreadsheets] = useState<DriveFileType[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSpreadsheets = useCallback(async () => {
    try {
      setLoading(true);
      const sheets = await listSpreadsheets(accessToken);
      setSpreadsheets(sheets);
    } catch (error) {
      console.error("Error loading spreadsheets:", error);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    loadSpreadsheets();
  }, [loadSpreadsheets]);

  if (loading) {
    return (
      <View className="mb-4">
        <Text className="text-white text-center">
          Cargando hojas de cálculo...
        </Text>
      </View>
    );
  }

  if (spreadsheets.length === 0) {
    return (
      <View className="mb-4">
        <Text className="text-gray-300 text-center">
          No se encontraron hojas de cálculo existentes
        </Text>
      </View>
    );
  }

  const options = spreadsheets.map((sheet) => ({
    label: `${sheet.name} (${new Date(sheet.modifiedTime).toLocaleDateString()})`,
    value: sheet.id,
  }));

  return (
    <Select
      label="Seleccionar Hoja de Cálculo Existente"
      value={selectedId || ""}
      options={options}
      onChange={onSelect}
      placeholder="Selecciona una hoja de cálculo..."
    />
  );
};
