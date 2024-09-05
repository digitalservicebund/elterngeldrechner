import { addDays } from "./addDays";

export const subDays = (days: number) => addDays(-1 * days);

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it("subtracts days", () => {
    expect(subDays(2)(new Date("2024-08-18"))).toStrictEqual(
      new Date("2024-08-16"),
    );
    expect(subDays(30000)(new Date("2024-08-18"))).toStrictEqual(
      new Date("1942-06-30"),
    );
  });
}
