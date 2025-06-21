import AsyncStorage from "@react-native-async-storage/async-storage";
import { EVENTS_PRICES } from "@/lib/consts/events";
import { useEffect, useState } from "react";

export type PriceSettings = {
  [key: number]: number;
};

const PRICE_SETTINGS_KEY = "PRICE_SETTINGS";

// Funciones utilitarias para manejar precios
export const loadPriceSettings = async (): Promise<PriceSettings> => {
  try {
    const stored = await AsyncStorage.getItem(PRICE_SETTINGS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return EVENTS_PRICES;
  } catch (error) {
    console.error("Error loading price settings:", error);
    return EVENTS_PRICES;
  }
};

export const savePriceSettings = async (
  prices: PriceSettings,
): Promise<void> => {
  try {
    await AsyncStorage.setItem(PRICE_SETTINGS_KEY, JSON.stringify(prices));
  } catch (error) {
    console.error("Error saving price settings:", error);
    throw error;
  }
};

export const updatePrice = async (
  duration: number,
  price: number,
): Promise<PriceSettings> => {
  try {
    const currentPrices = await loadPriceSettings();
    const newPrices = { ...currentPrices, [duration]: price };
    await savePriceSettings(newPrices);
    return newPrices;
  } catch (error) {
    console.error("Error updating price:", error);
    throw error;
  }
};

export const resetPricesToDefaults = async (): Promise<PriceSettings> => {
  try {
    await AsyncStorage.removeItem(PRICE_SETTINGS_KEY);
    return EVENTS_PRICES;
  } catch (error) {
    console.error("Error resetting prices:", error);
    throw error;
  }
};

export const getPrice = async (duration: number): Promise<number> => {
  try {
    const prices = await loadPriceSettings();
    return (
      prices[duration] ||
      EVENTS_PRICES[duration as keyof typeof EVENTS_PRICES] ||
      0
    );
  } catch (error) {
    console.error("Error getting price:", error);
    return EVENTS_PRICES[duration as keyof typeof EVENTS_PRICES] || 0;
  }
};

// Hook personalizado para usar en componentes que necesiten reactividad
export const usePriceSettings = () => {
  const [prices, setPrices] = useState<PriceSettings>(EVENTS_PRICES);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPrices = async () => {
      try {
        const loadedPrices = await loadPriceSettings();
        setPrices(loadedPrices);
      } catch (error) {
        console.error("Error in usePriceSettings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPrices();
  }, []);

  const updatePriceAndRefresh = async (duration: number, price: number) => {
    try {
      const newPrices = await updatePrice(duration, price);
      setPrices(newPrices);
    } catch (error) {
      console.error("Error updating price:", error);
      throw error;
    }
  };

  const resetAndRefresh = async () => {
    try {
      const defaultPrices = await resetPricesToDefaults();
      setPrices(defaultPrices);
    } catch (error) {
      console.error("Error resetting prices:", error);
      throw error;
    }
  };

  return {
    prices,
    isLoading,
    updatePrice: updatePriceAndRefresh,
    resetToDefaults: resetAndRefresh,
  };
};
