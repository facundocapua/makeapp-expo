import { useEffect, useState } from "react";
import { getPrice, loadPriceSettings } from "@/lib/price-settings";

// Ejemplo de uso directo sin Context
export const useEventPrice = (duration: number) => {
  const [price, setPrice] = useState<number>(0);

  useEffect(() => {
    const fetchPrice = async () => {
      const eventPrice = await getPrice(duration);
      setPrice(eventPrice);
    };

    fetchPrice();
  }, [duration]);

  return price;
};

// Ejemplo de uso de funciones utilitarias directas
export const createEventWithCurrentPrices = async (duration: number) => {
  // Cargar todos los precios actuales
  const prices = await loadPriceSettings();

  // Obtener precio específico para la duración
  const eventPrice = await getPrice(duration);

  return {
    duration,
    price: eventPrice,
    allPrices: prices,
  };
};
