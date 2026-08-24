import { DateUtils } from "./date.utils";

describe("DateUtils", () => {
  it("parses and formats display dates (dd/MM/yyyy)", () => {
    const date = DateUtils.parseDisplayDate("25/12/2024");
    expect(DateUtils.formatDisplayDate(date)).toBe("25/12/2024");
  });

  it("parses and formats dashed dates (dd-MM-yyyy)", () => {
    const date = DateUtils.parseDashedDate("25-12-2024");
    expect(DateUtils.formatDashedDate(date)).toBe("25-12-2024");
  });

  it("parses and formats ISO dates (yyyy-MM-dd)", () => {
    const date = DateUtils.parseISODate("2024-12-25");
    expect(DateUtils.formatISODate(date)).toBe("2024-12-25");
  });

  it("checks whether a date is within an inclusive range", () => {
    const start = new Date(2024, 0, 1);
    const end = new Date(2024, 0, 31);
    const inside = new Date(2024, 0, 15);
    const outside = new Date(2024, 1, 1);

    expect(DateUtils.isDateInRange(inside, start, end)).toBe(true);
    expect(DateUtils.isDateInRange(outside, start, end)).toBe(false);
    expect(DateUtils.isDateInRange(start, start, end)).toBe(true);
    expect(DateUtils.isDateInRange(end, start, end)).toBe(true);
  });

  it("treats a null start/end as an open range", () => {
    const date = new Date(2024, 0, 15);
    expect(DateUtils.isDateInRange(date, null, null)).toBe(true);
  });

  it("compares two dates ignoring time", () => {
    const a = new Date(2024, 0, 1, 8, 0);
    const b = new Date(2024, 0, 1, 20, 0);
    const c = new Date(2024, 0, 2);

    expect(DateUtils.isSameDate(a, b)).toBe(true);
    expect(DateUtils.isSameDate(a, c)).toBe(false);
  });

  it("computes days between two dates", () => {
    const start = new Date(2024, 0, 1);
    const end = new Date(2024, 0, 11);
    expect(DateUtils.daysBetween(start, end)).toBe(10);
  });
});
