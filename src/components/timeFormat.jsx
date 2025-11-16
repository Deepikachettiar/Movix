const timeFormat = (timeInMinutes) => {
  const hours = Math.floor(timeInMinutes / 60);
  const minutes = timeInMinutes % 60;
  return `${hours}h ${minutes}m`;
}   
export default timeFormat;