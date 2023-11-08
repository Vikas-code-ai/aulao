const zeroPad = (n: number | string) => String(n).padStart(2, "0");

export function toHour(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins > 0 ? `${mins}m` : ""}`;
}

export function toHourMinutes(minutes: number): string[] {
  return [zeroPad(Math.floor(minutes / 60)), zeroPad(minutes % 60)];
}

export const timeDate = (time: string) => new Date(`1970-01-01T${time}`);

export const toTimeString = (date: Date) =>
  `${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
