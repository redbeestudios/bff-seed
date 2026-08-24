import {
  format,
  parse,
  isAfter,
  isBefore,
  isEqual,
  addDays,
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  differenceInDays,
} from "date-fns";

export class DateUtils {
  static parseDisplayDate(dateString: string): Date {
    return parse(dateString, "dd/MM/yyyy", new Date());
  }

  static parseDashedDate(dateString: string): Date {
    return parse(dateString, "dd-MM-yyyy", new Date());
  }

  static parseISODate(dateString: string): Date {
    return parse(dateString, "yyyy-MM-dd", new Date());
  }

  static formatDisplayDate(date: Date): string {
    return format(date, "dd/MM/yyyy");
  }

  static formatDisplayDateWithTime(date: Date): string {
    return format(date, "dd MMM yyyy - HH:mm'hs'");
  }

  static formatDashedDate(date: Date): string {
    return format(date, "dd-MM-yyyy");
  }

  static formatISODate(date: Date): string {
    return format(date, "yyyy-MM-dd");
  }

  static isDateInRange(
    date: Date,
    startDate: Date | null,
    endDate: Date | null,
  ): boolean {
    const dateToCompare = startOfDay(date);

    if (startDate && endDate) {
      const start = startOfDay(startDate);
      const end = endOfDay(endDate);
      return (
        (isAfter(dateToCompare, start) || isEqual(dateToCompare, start)) &&
        (isBefore(dateToCompare, end) || isEqual(dateToCompare, end))
      );
    } else if (startDate) {
      const start = startOfDay(startDate);
      return isAfter(dateToCompare, start) || isEqual(dateToCompare, start);
    } else if (endDate) {
      const end = endOfDay(endDate);
      return isBefore(dateToCompare, end) || isEqual(dateToCompare, end);
    }
    return true;
  }

  static isSameDate(date1: Date, date2: Date): boolean {
    return format(date1, "yyyy-MM-dd") === format(date2, "yyyy-MM-dd");
  }

  static today(): Date {
    return startOfDay(new Date());
  }

  static yesterday(): Date {
    return startOfDay(addDays(new Date(), -1));
  }

  static firstDayOfCurrentMonth(): Date {
    return startOfMonth(new Date());
  }

  static lastDayOfCurrentMonth(): Date {
    return endOfMonth(new Date());
  }

  static daysBetween(startDate: Date, endDate: Date): number {
    return differenceInDays(endDate, startDate);
  }

  static daysAgo(days: number): Date {
    return startOfDay(addDays(new Date(), -days));
  }
}
