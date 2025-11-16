const dateFormat = (dateInput) => {
  if (!dateInput) return "Date not available";

  // Try to convert it into a valid Date object
  let date = new Date(dateInput);

  // If still invalid (common for "YYYY-MM-DD HH:mm" formats)
  if (isNaN(date.getTime()) && typeof dateInput === "string") {
    // Try replacing space with 'T' to make it ISO-compliant
    date = new Date(dateInput.replace(" ", "T"));
  }

  if (isNaN(date.getTime())) return "Invalid Date";

  return date.toLocaleString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export default dateFormat;
