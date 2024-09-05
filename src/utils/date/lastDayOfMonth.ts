import { isLeapYear } from "./isLeapYear";

const february = 1;
const april = 3;
const june = 5;
const september = 8;
const november = 10;

export const lastDayOfMonth = (date: Date) => {
  const months30 = [april, june, september, november];
  const month = date.getMonth();

  if (month === february) return isLeapYear(date) ? 29 : 28;
  if (months30.includes(month)) return 30;
  return 31;
};

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it("returns 28", () => {
    expect(lastDayOfMonth(new Date("2023-02-18"))).toBe(28);
  });
  it("returns 29", () => {
    expect(lastDayOfMonth(new Date("2024-02-18"))).toBe(29);
  });
  it("returns 30", () => {
    expect(lastDayOfMonth(new Date("2024-09-18"))).toBe(30);
  });
  it("returns 31", () => {
    expect(lastDayOfMonth(new Date("2024-08-18"))).toBe(31);
  });
}
