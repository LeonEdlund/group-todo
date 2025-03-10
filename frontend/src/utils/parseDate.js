import { format, parseISO } from "date-fns";

export default function parseDate(date) {
  return format(parseISO(date), "dd/MM-yy");
}