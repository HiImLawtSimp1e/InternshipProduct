import { parse, format } from "date-fns";

export const parseDateTimeToIso8601 = (dateString: string): string => {
  const date = parse(dateString, "yyyy-MM-dd", new Date());
  return format(date, "yyyy-MM-dd'T'HH:mm:ssxxx");
};
