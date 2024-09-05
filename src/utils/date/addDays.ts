export const addDays = (days: number) => {
  return (date: Date) => {
    const d = new Date(date.valueOf());
    d.setDate(d.getDate() + days);
    return d;
  };
};

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  it("returns a new Date instance", () => {
    const givenDate = new Date("2024-08-18");
    const returnedDate = addDays(2)(givenDate);
    expect(returnedDate).not.toBe(givenDate);
    expect(returnedDate.getDate()).toEqual(20);
    expect(givenDate.getDate()).toEqual(18);
  });

  it("adds days", () => {
    expect(addDays(2)(new Date("2024-08-18"))).toStrictEqual(
      new Date("2024-08-20"),
    );
    expect(addDays(30000)(new Date("2024-08-18"))).toStrictEqual(
      new Date("2106-10-08"),
    );
  });
}
