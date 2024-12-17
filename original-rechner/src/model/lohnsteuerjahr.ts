export const UnterstuetzteLohnsteuerjahre = [2022, 2023] as const;
export type Lohnsteuerjahr = (typeof UnterstuetzteLohnsteuerjahre)[number];
