import { Auswahloption, Auswahloptionen } from "@/monatsplaner/Auswahloption";

export type VerplantesKontingent = Readonly<Record<Auswahloption, number>>;

export const LEERES_VERPLANTES_KONTINGENT = Object.fromEntries(
  Auswahloptionen.map((option) => [option, 0]),
) as VerplantesKontingent;
