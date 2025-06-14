export const EVENTS_DURATION = [
  { label: "30 minutos", value: 30 },
  { label: "45 minutos", value: 45 },
  { label: "1 hora", value: 60 },
  { label: "1 hora 30 minutos", value: 90 },
  { label: "2 horas", value: 120 },
];

export const EVENTS_PRICES = {
  30: 10000,
  45: 15000,
  60: 20000,
  90: 30000,
  120: 40000,
} as const;
