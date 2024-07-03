export type Calendar = Pick<PartialDate, "year" | "month">;
export type Time = Pick<PartialDate, "hour" | "minute">;

export type PartialDate = {
  year: number;
  month: number;
  date: number;
  hour: number;
  minute: number;
  second: number;
};

export type OptionalyPartialDate = {
  year?: number;
  month?: number;
  date?: number;
  hour?: number;
  minute?: number;
  second?: number;
};

export const FORMAT = {
  DATE: "yyyy/MM/dd",
  TIME: "HH:mm",
} as const;

export const isDate = (date?: Date): boolean => {
  return date instanceof Date;
};

export const isTimeFormat = (str?: string) => {
  return str?.match(/^\d{1,2}:\d{2}$/);
};

export const canConvertDate = (str?: string): boolean => {
  return !isNaN(new Date(str ?? "").getTime());
};

export const formatForCalendar = (date?: Date): string => {
  return formatDate(date, FORMAT.DATE);
};

export const formatForTime = (date?: Date): string => {
  return formatDate(date, FORMAT.TIME);
};

export const formatDate = (_date?: Date, _format?: string): string => {
  if (!isDate(_date)) return "";
  let format = _format ?? `${FORMAT.DATE} ${FORMAT.TIME}`;
  const { year, month, date, hour, minute, second } = splitDateAsObject(_date);
  format = format.replace(/yyyy/g, `${year}`);
  format = format.replace(/MM/g, `0${month}`.slice(-2));
  format = format.replace(/dd/g, `0${date}`.slice(-2));
  format = format.replace(/HH/g, `0${hour}`.slice(-2));
  format = format.replace(/mm/g, `0${minute}`.slice(-2));
  format = format.replace(/ss/g, `0${second}`.slice(-2));
  return format;
};

export const partialUpdateDate = (
  date: Date,
  partialDate: OptionalyPartialDate
): Date => {
  const result = new Date(date.getTime());
  if (partialDate.year) {
    result.setFullYear(partialDate.year);
  }
  if (partialDate.month) {
    result.setMonth(partialDate.month - 1);
  }
  if (partialDate.date) {
    result.setDate(partialDate.date);
  }
  if (partialDate.hour != null) {
    result.setHours(partialDate.hour);
  }
  if (partialDate.minute != null) {
    result.setMinutes(partialDate.minute);
  }
  return result;
};

export const splitDateAsObject = (date?: Date): PartialDate => {
  const result = isDate(date) ? (date as Date) : new Date();
  return {
    year: result?.getFullYear(),
    month: result.getMonth() + 1,
    date: result.getDate(),
    hour: result.getHours(),
    minute: result.getMinutes(),
    second: result.getSeconds(),
  };
};

export const getTimeChoicesOnDay = (): string[] => {
  const hours = [...Array(24)].map((_, index) => `${index}`);
  const minutes = ["00", "30"];

  return hours.reduce((timeChoicesOnDay, hour) => {
    const choicesOnHour = minutes.map((minute) => {
      return `${hour}:${minute}`;
    });
    return timeChoicesOnDay.concat(choicesOnHour);
  }, [] as string[]);
};
