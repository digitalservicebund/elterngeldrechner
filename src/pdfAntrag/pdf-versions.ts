interface FieldNames {
  vornameET1: string;
  vornameET2: string;
  basisET1: string;
  basisET2: string;
  plusET1: string;
  plusET2: string;
  bonusET1: string;
  bonusET2: string;
}

type PdfVersions = {
  start: Date;
  end: Date;
  fieldNames: FieldNames;
  pdfFileName: string;
};

const fieldNamesBeforeApril2024 = {
  vornameET1: "string",
  vornameET2: "string",
  basisET1: "string",
  basisET2: "string",
  plusET1: "string",
  plusET2: "string",
  bonusET1: "string",
  bonusET2: "string",
} as const satisfies FieldNames;

const fieldNamesFromApril2024 = {
  vornameET1: "txt.vorname2b",
  vornameET2: "txt.vorname2b 1",
  basisET1: "cb_BG_",
  basisET2: "cb_BG_",
  plusET1: "cb_E+_",
  plusET2: "cb_E+_",
  bonusET1: "cb_PB_",
  bonusET2: "cb_PB_",
} as const satisfies FieldNames;

const fieldNamesFromApril2025 = {
  vornameET1: "2b Vorname(n) AS",
  vornameET2: "2b Vorname(n) 2E",
  basisET1: "10 Basiselterngeld AS Monat",
  basisET2: "10 Basiselterngeld 2E Monat",
  plusET1: "10 Elterngeld Plus AS Monat",
  plusET2: "10 Elterngeld Plus 2E Monat",
  bonusET1: "10 P-Bonus AS Monat",
  bonusET2: "10 P-Bonus 2E Monat",
} as const satisfies FieldNames;

const pdfVersions: PdfVersions[] = [
  {
    start: new Date("2020-01-01"),
    end: new Date("2024-03-31"),
    fieldNames: fieldNamesBeforeApril2024,
    pdfFileName: "bis2024-03-31",
  },
  {
    start: new Date("2024-04-01"),
    end: new Date("2025-03-31"),
    fieldNames: fieldNamesFromApril2024,
    pdfFileName: "von2024-04-01bis2025-03-31",
  },
  {
    start: new Date("2025-04-01"),
    end: new Date("2100-03-31"),
    fieldNames: fieldNamesFromApril2025,
    pdfFileName: "von2025-04-01",
  },
] as const;

export function getFieldNames(date: Date) {
  for (const { start, end, fieldNames } of pdfVersions) {
    if (date >= start && date <= end) {
      return fieldNames;
    }
  }
  return null;
}

export function getPdfFileName(date: Date) {
  for (const { start, end, pdfFileName } of pdfVersions) {
    if (date >= start && date <= end) {
      return pdfFileName;
    }
  }
  return null;
}
