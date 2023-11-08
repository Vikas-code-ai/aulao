import {
  timeDate,
  toHour,
  toHourMinutes,
  toTimeString,
} from "~/utils/timeHelpers";

type TimeProps = {
  starttime: string;
  duration: number;
};

type DurationProps = {
  minutes: number;
};

export const Time = ({ starttime, duration }: TimeProps) => {
  const time = timeDate(starttime);

  return (
    <>
      {toTimeString(time)} -{" "}
      {toTimeString(new Date(time.getTime() + duration * 60000))}
    </>
  );
};

export const Duration = ({ minutes }: DurationProps) => <>{toHour(minutes)}</>;
