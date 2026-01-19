export type Lohnsteuerjahr = (typeof UnterstuetzteLohnsteuerjahre)[number];

export const UnterstuetzteLohnsteuerjahre = [
  2021, 2022, 2023, 2024, 2025, 2026,
] as const;
