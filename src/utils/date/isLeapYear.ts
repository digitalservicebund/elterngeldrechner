export const isLeapYear = (date: Date) => {
  const year = date.getFullYear();
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it.each([
    new Date("2000-01-01"),
    new Date("2024-01-01"),
    new Date("2028-01-01"),
    new Date("2032-01-01"),
  ])("isLeap(%i) -> true", (date) => {
    expect(isLeapYear(date)).toBe(true);
  });

  it.each([
    new Date("2001-01-01"),
    new Date("2023-01-01"),
    new Date("2025-01-01"),
    new Date("2031-01-01"),
  ])("isLeap(%i) -> false", (date) => {
    expect(isLeapYear(date)).toBe(false);
  });
}
