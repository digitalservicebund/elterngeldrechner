export function fromGermanDateString(dateString: string): Date {
  const [day, month, year] = dateString.split(".");
  return new Date(
    Date.UTC(
      Number.parseInt(year),
      Number.parseInt(month) - 1,
      Number.parseInt(day),
    ),
  );
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it.each([
    ["01.01.2024", new Date(Date.UTC(2024, 0, 1))],
    ["31.12.2024", new Date(Date.UTC(2024, 11, 31))],
    ["29.02.2024", new Date(Date.UTC(2024, 1, 29))],
    ["28.02.2023", new Date(Date.UTC(2023, 1, 28))],
  ])("fromGermanDateString(%s) -> %j", (dateString, expectedDate) => {
    expect(fromGermanDateString(dateString)).toStrictEqual(expectedDate);
  });
}
