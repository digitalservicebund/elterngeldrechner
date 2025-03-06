export type Lohnsteuerjahr = (typeof UnterstuetzteLohnsteuerjahre)[number];

export const UnterstuetzteLohnsteuerjahre = [2021, 2022, 2023, 2024] as const;
