export const formatDisplayName = (name) => {
  if (String(name) === "") return "Anónimo";

  return name;
};

export const formatDateComputer = (date) => {
  const dateObj = new Date(date);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");

  return [year, month, day].join("-");
};

export const formatDate = (date) => {
  const dateObj = new Date(date);
  const options = {
    day: "2-digit",
    month: "short",
    weekday: "long",
    year: "numeric",
    hour12: false,
  };

  return dateObj.toLocaleDateString("es-AR", options);
};

export const formatDateShort = (date) => {
  const dateObj = new Date(date);
  const options = {
    day: "2-digit",
    month: "2-digit",
    hour12: false,
  };

  return dateObj.toLocaleDateString("es-AR", options);
};

export const formatDateTime = (date) => {
  const dateObj = new Date(date);
  const options = {
    day: "numeric",
    month: "short",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  return dateObj.toLocaleDateString("es-AR", options);
};

export const formatTime = (date, round = true) => {
  const dateObj = new Date(date);
  if (round) {
    const roundedMinutes = Math.round(dateObj.getMinutes() / 15) * 15;
    dateObj.setMinutes(roundedMinutes);
  }
  const options = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };
  return dateObj.toLocaleString("es-AR", options);
};

export const formatNotes = (notes) => {
  if (notes === "") return "Sin notas";

  return notes;
};
