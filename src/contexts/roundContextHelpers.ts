export function getDateAndTimeStrings() {
  const now = new Date();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  const formattedSeconds = seconds < 10 ? "0" + seconds : seconds;
  const currentTimeString = `${now.getHours()}:${formattedMinutes}:${formattedSeconds}`;
  return { currentDateString: now.toDateString(), currentTimeString };
}
