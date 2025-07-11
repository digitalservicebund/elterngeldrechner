import { pdfVersionVorApril2024 } from "./pdfVersion/bis2024-03-31";
import { pdfVersionZwischenApril2024UndApril2025 } from "./pdfVersion/von2024-04-01bis2025-03-31";
import { pdfVersionVonApril2025 } from "./pdfVersion/von2025-04-01";
import { Elternteil, Lebensmonatszahl, Variante } from "@/monatsplaner";

const pdfVersions = [
  pdfVersionVorApril2024,
  pdfVersionZwischenApril2024UndApril2025,
  pdfVersionVonApril2025,
] as const;

export function getFieldName({
  geburtsdatum,
  variante,
  elternteil,
  lebensmonat,
}: {
  geburtsdatum: Date;
  variante: Variante;
  elternteil: Elternteil;
  lebensmonat: Lebensmonatszahl;
}) {
  const fieldName =
    getPdfVersion(geburtsdatum)?.fieldNames[variante][elternteil][
      (lebensmonat as number) - 1
    ];
  if (!fieldName) {
    throw Error("PDF Version not found");
  }
  return fieldName;
}

export function getFieldNameForVornamen(geburtsdatum: Date) {
  const fieldNames = getPdfVersion(geburtsdatum)?.fieldNames.vorname;
  if (!fieldNames) {
    throw Error("PDF Version not found");
  }
  return fieldNames;
}

export function getPdfVersion(date: Date) {
  return pdfVersions.find(
    (pdfVersion) => date >= pdfVersion.start && date <= pdfVersion.end,
  );
}
